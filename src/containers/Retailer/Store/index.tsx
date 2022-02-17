import React, { ReactNode, useContext, useEffect, useState } from "react";
import { createStyles, makeStyles, Theme, Grid } from "@material-ui/core";
import { CONTRACT_ADDRESS, YOUR_ADDRESS } from "../../../utils/constants";
import { Web3Context } from "../../../context/Web3Context";
import { IWeb3State } from "../../../models/web3.interface";
import { ISpinnerState } from "../../../models/spinner.interface";
import { SpinnerContext } from "../../../context/SpinnerContext";
import ContactsOutlinedIcon from "@material-ui/icons/ContactsOutlined";
import TransporterListComponent from "../../../components/TransporterList";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import { IAddressBar } from "../../../models/addressbar.interface";
import AddressBarComponent from "../../../components/AddressBar";
import { RetailerContext } from "../../../context/RetailerContext";
import { IRetailerContext } from "../../../models/retailer.interface";
import {
  getTransactionData,
  sendTransaction,
} from "../../../services/contractAPI";
import { ToastContext } from "../../../context/ToastContext";
import { ISummaryBar } from "../../../models/summarybar.interface";
import SummaryBarComponent from "../../../components/SummaryBar";
import PanelLayout from "../../../layout/Panel";
import withUsers from "../../../hoc/withUsers";
import useProductDetails from "../../../hooks/useProductDetails";
import ProductsDeliveredAtStoreComponent from "../../../components/ProductsDeliveredAtStore";
import { IProduct } from "../../../models/product.interface";
import {
  decodeTxDetails,
  populateRoleBasedList,
  populateStoreSummary,
} from "../../../utils/helpers";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import SellIcon from "@mui/icons-material/Sell";
import { updateTxDatabase } from "../../../services/firebaseAPI";
import { IDialogContext } from "../../../models/dialog.interface";
import { DialogContext } from "../../../context/DialogContext";
import ProductSearchComponent from "../../ProductSearch";
import DistributorListComponent from "../../../components/DistributorList";
import _ from "lodash";
import useCount from "../../../hooks/useCount";
import OrderRequestContainer from "../../OrderRequest";
import { OrderRequestContextProvider } from "../../../context/OrderRequestContext";

type RetailerDashboardProps = {};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "15px",
      marginBottom: "15px",
    },
  })
);

const AAPStoreComponent = (props: any) => {
  const classes = useStyles();
  const loadProductDetails = useProductDetails();
  const counter = useCount();
  const userListState = props["userList"];

  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;

  const spinnerContext = useContext<ISpinnerState>(SpinnerContext);
  const { toggleSpinner } = spinnerContext;

  const toastContext = useContext<any>(ToastContext);
  const { toggleToast } = toastContext;

  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { updateDialogStatus } = dialogContext;

  const retailerContext = useContext<IRetailerContext>(RetailerContext);
  const {
    products,
    soldOutCount,
    approvedCount,
    damagedCount,
    rejectedCount,
    updateSoldOutCount,
    updateApprovedCount,
    updateDamageCount,
    updateRejectedCount,
    storeRetailerDashboardData,
  } = retailerContext;

  const [approvedProducts, setApprovedProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    try {
      if (contractInstance) {
        toggleSpinner();
        const ProductResult: Promise<any> = getTransactionData(
          contractInstance,
          "getRetailerAssignedProductBatches",
          selectedAccount,
          selectedAccount
        );
        ProductResult.then(async (productIds: any) => {
          if (productIds.length == 0) toggleSpinner();
          let _batchesRecievedCount = 0;
          let _batchesRejectedCount = 0;
          let _batchesApprovedCount = 0;

          let _listOfProduct: IProduct[] = [];
          let _approvedProducts: IProduct[] = [];
          productIds.forEach((productId: any) => {
            loadProductDetails(productId)
              .then((record: any) => {
                const productData: IProduct = {
                  ...record,
                  ...record.productBasicInfo,
                  ...record.productAdvanceInfo,
                };
                _listOfProduct.push(productData);
                if (productData.productAdvanceInfo.batchStatus == 6) {
                  _approvedProducts.push(productData);
                }
                [
                  _batchesRecievedCount,
                  _batchesRejectedCount,
                  _batchesApprovedCount,
                ] = populateStoreSummary(
                  _batchesRecievedCount,
                  _batchesRejectedCount,
                  _batchesApprovedCount,
                  productData
                );
                if (_listOfProduct.length === productIds.length) {
                  setApprovedProducts(_approvedProducts);
                  storeRetailerDashboardData(
                    _.orderBy(
                      [..._listOfProduct],
                      (item: IProduct) =>
                        item.productAdvanceInfo.lastModifiedTimestamp,
                      "desc"
                    ),
                    _batchesRecievedCount,
                    _batchesApprovedCount,
                    _batchesRejectedCount
                  );
                  toggleSpinner();
                }
              })
              .catch((e: any) => {
                toggleSpinner();
                toggleToast("error", e?.errorMessage);
              });
          });

          updateApprovedCount(await counter("getApprovedCount"));
          updateRejectedCount(await counter("getRejectedCount"));
          updateSoldOutCount(await counter("getSoldOutCount"));
          // updateDamageCount(await counter("getDamagedCount"));  Not needed
        }).catch((e: any) => {
          toggleSpinner();
          toggleToast("error", e?.errorMessage);
        });
      }
    } catch (e: any) {
      toggleSpinner();
      toggleToast("error", e?.errorMessage);
    }
  }, []);

  const updateProductStatus = (productData: IProduct, isApprove: boolean) => {
    try {
      const _reasonEle: HTMLInputElement = document.getElementById(
        "reasonForRejection"
      ) as HTMLInputElement;
      if (contractInstance) {
        toggleSpinner();
        const result: Promise<any> = sendTransaction(
          contractInstance,
          "updateProductBatchStatusOnReceive",
          selectedAccount,
          productData.productBasicInfo.productId,
          isApprove,
          !isApprove ? _reasonEle.value : ""
        );
        result
          .then(async (response) => {
            const UpdatedProductBatchStatusEvt =
              response?.events["UpdatedProductBatchStatusEvt"]["returnValues"];
            const _productList = [...products];
            let _batchesRecievedCount = 0;
            let _batchesRejectedCount = 0;
            let _batchesApprovedCount = 0;
            //get updated product details
            const _updatedList = _productList.map((product: IProduct) => {
              if (
                product.productBasicInfo.productId ==
                productData.productBasicInfo.productId
              ) {
                const updatedProductBatchForTransfer: IProduct = {
                  ...product,
                  productBasicInfo: {
                    ...product.productBasicInfo,
                    productId: UpdatedProductBatchStatusEvt["productId"],
                  },
                  productAdvanceInfo: {
                    ...product.productAdvanceInfo,
                    batchStatus: UpdatedProductBatchStatusEvt["status"],
                    reasonForPackageRejection: !isApprove
                      ? _reasonEle.value
                      : "",
                  },
                };
                const OrderStatusEvt =
                  response?.events["UpdatedOrderStatusEvt"]["returnValues"];
                if (OrderStatusEvt) {
                  updatedProductBatchForTransfer.productBasicInfo.orderRequestId =
                    OrderStatusEvt["orderRequestId"];
                  updatedProductBatchForTransfer.productBasicInfo.orderSubmissionDate =
                    OrderStatusEvt["submissionTimestamp"];
                  updatedProductBatchForTransfer.productAdvanceInfo.orderModifiedDate =
                    OrderStatusEvt["orderModifiedDate"];
                  updatedProductBatchForTransfer.productAdvanceInfo.orderStatus =
                    OrderStatusEvt["orderStatus"];
                  updateTxDatabase(
                    response,
                    updatedProductBatchForTransfer,
                    userListState.users,
                    updatedProductBatchForTransfer.productAdvanceInfo
                      .batchStatus == 5
                      ? "Package is rejected & sent back to Distributor"
                      : "Package is verified & accepted",
                    updatedProductBatchForTransfer.productAdvanceInfo
                      .batchStatus == 5
                      ? "Package is rejected on"
                      : "Package is accepted on",
                    "retailer",
                    true
                  );
                }
                if (
                  updatedProductBatchForTransfer.productAdvanceInfo
                    .batchStatus == 6
                ) {
                  approvedProducts.push(updatedProductBatchForTransfer);
                  setApprovedProducts(approvedProducts.slice(0));
                }
                return updatedProductBatchForTransfer;
              } else {
                return product;
              }
            });
            storeRetailerDashboardData(
              _updatedList.slice(0),
              _batchesRecievedCount,
              _batchesApprovedCount,
              _batchesRejectedCount,
              soldOutCount
            );

            updateApprovedCount(await counter("getApprovedCount"));
            updateRejectedCount(await counter("getRejectedCount"));

            toggleToast("success", "Product batch has been updated");
          })
          .catch((e: any) => {
            toggleToast("error", e?.errorMessage);
          })
          .finally(() => {
            toggleSpinner();
            updateDialogStatus(false, false);
          });
      }
    } catch (e: any) {
      toggleSpinner();
      toggleToast("error", e?.errorMessage);
    }
  };

  const populateDashboardSummaryBarData = (): ISummaryBar[] => {
    const summaryBarList: ISummaryBar[] = [
      {
        sizeXS: 12,
        sizeSM: 3,
        label: "Total Packages Received",
        value: products.length,
        iconComp: <LocalShippingIcon fontSize="large" color="primary" />,
      },
      {
        sizeXS: 12,
        sizeSM: 3,
        label: "Packages Approved",
        value: approvedCount,
        iconComp: <ThumbUpIcon fontSize="large" style={{ color: "#006400" }} />,
      },
      {
        sizeXS: 12,
        sizeSM: 3,
        label: "Packages Rejected",
        value: rejectedCount,
        iconComp: (
          <ThumbDownIcon fontSize="large" style={{ color: "#565F5F" }} />
        ),
      },
      {
        sizeXS: 12,
        sizeSM: 3,
        label: "Products Sold",
        value: soldOutCount,
        iconComp: <SellIcon fontSize="large" style={{ color: "#4BB543" }} />,
      },
    ];

    return summaryBarList;
  };

  const refreshSoldOutCount = async () => {
    updateSoldOutCount(await counter("getSoldOutCount"));
  };

  const populateUserAddressBarData = (): IAddressBar[] => {
    const addressBarList: IAddressBar[] = [
      {
        sizeXS: 12,
        sizeSM: 6,
        sizeLG: 6,
        label: YOUR_ADDRESS,
        value: selectedAccount,
        iconComp: <ContactsOutlinedIcon style={{ color: "#cc3300" }} />,
      },
      {
        sizeXS: 12,
        sizeSM: 6,
        sizeLG: 6,
        label: CONTRACT_ADDRESS,
        value: contractInstance?._address,
        iconComp: <ContactsOutlinedIcon style={{ color: "#cc3300" }} />,
      },
    ];
    return addressBarList;
  };

  const populateRegisteredUsersGrid = (): ReactNode => {
    const list = populateRoleBasedList(userListState.users);
    return (
      <Grid container spacing={2} style={{ paddingTop: 40 }}>
        <Grid item xs={12} sm={12} lg={6}>
          <TransporterListComponent list={list.transporterList} />
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <DistributorListComponent list={list.distributorList} />
        </Grid>
      </Grid>
    );
  };

  return (
    <div className={classes.root}>
      <SummaryBarComponent summaryBarList={populateDashboardSummaryBarData()} />
      <AddressBarComponent addressBarList={populateUserAddressBarData()} />
      <PanelLayout panelTitle="" styleItem={{ paddingTop: 20 }}>
        <ProductSearchComponent
          placeholder="Search Product"
          options={approvedProducts}
          userListState={userListState}
          refreshSoldOutCount={refreshSoldOutCount}
        />
      </PanelLayout>
      <PanelLayout panelTitle="Batches Overview" styleItem={{ paddingTop: 20 }}>
        <ProductsDeliveredAtStoreComponent
          products={products}
          userList={userListState.users}
          updateProductStatus={updateProductStatus}
        />
      </PanelLayout>
      <PanelLayout panelTitle="Orders Overview" styleItem={{ paddingTop: 20 }}>
        <OrderRequestContextProvider>
          <OrderRequestContainer userList={userListState.users} />
        </OrderRequestContextProvider>
      </PanelLayout>
      {populateRegisteredUsersGrid()}
    </div>
  );
};

export default withUsers(AAPStoreComponent);
