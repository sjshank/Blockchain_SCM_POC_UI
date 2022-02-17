import React, { useContext, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import ContactsOutlinedIcon from "@material-ui/icons/ContactsOutlined";
import AddressBarComponent from "../../../components/AddressBar";
import { IAddressBar } from "../../../models/addressbar.interface";
import { IProduct } from "../../../models/product.interface";
import { CONTRACT_ADDRESS, YOUR_ADDRESS } from "../../../utils/constants";
import { IWeb3State } from "../../../models/web3.interface";
import { Web3Context } from "../../../context/Web3Context";
import { ITransporterContext } from "../../../models/transporter.interface";
import { TransporterContext } from "../../../context/TransporterContext";
import PanelLayout from "../../../layout/Panel";
import {
  getTransactionData,
  sendTransaction,
} from "../../../services/contractAPI";
import useProductDetails from "../../../hooks/useProductDetails";
import { SpinnerContext } from "../../../context/SpinnerContext";
import { ISpinnerState } from "../../../models/spinner.interface";
import { ToastContext } from "../../../context/ToastContext";
import ProductShipmentComponent from "../../../components/ProductShipment";
import withUsers from "../../../hoc/withUsers";
import { IDialogContext } from "../../../models/dialog.interface";
import { DialogContext } from "../../../context/DialogContext";
import { ISummaryBar } from "../../../models/summarybar.interface";
import DnsOutlinedIcon from "@material-ui/icons/DnsOutlined";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import SummaryBarComponent from "../../../components/SummaryBar";
import {
  populateRoleBasedList,
  populateShipmentSummary,
} from "../../../utils/helpers";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { updateTxDatabase } from "../../../services/firebaseAPI";
import RegisteredUsersBarComponent from "../../../components/RegisteredUsersBar";
import _ from "lodash";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "15px",
      marginBottom: "15px",
    },
  })
);

const ShipmentBoardComponent = (props: any) => {
  const classes = useStyles();
  const loadProductDetails = useProductDetails();
  const userListState = props["userList"];

  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;

  const spinnerContext = useContext<ISpinnerState>(SpinnerContext);
  const { toggleSpinner } = spinnerContext;

  const toastContext = useContext<any>(ToastContext);
  const { toggleToast } = toastContext;

  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { dialogStatus, updateDialogStatus } = dialogContext;

  const transporterContext =
    useContext<ITransporterContext>(TransporterContext);
  const {
    products,
    shipmentRequestCount,
    underTransitCount,
    packagesDeliveredCount,
    setProductList,
    storeTransporterDashboardData,
  } = transporterContext;

  useEffect(() => {
    try {
      if (contractInstance) {
        toggleSpinner();
        const ProductResult: Promise<any> = getTransactionData(
          contractInstance,
          "getTransporterAssignedProductBatches",
          selectedAccount,
          selectedAccount
        );
        let _shipmentRequestCount = 0;
        let _underTransitCount = 0;
        let _packagesDeliveredCount = 0;

        ProductResult.then((productIds: any) => {
          if (productIds.length == 0) toggleSpinner();
          let _listOfProduct: IProduct[] = [];
          productIds.forEach((productId: any) => {
            loadProductDetails(productId)
              .then((record: any) => {
                const productData: IProduct = {
                  ...record,
                  ...record.productBasicInfo,
                  ...record.productAdvanceInfo,
                };
                [
                  _shipmentRequestCount,
                  _underTransitCount,
                  _packagesDeliveredCount,
                ] = populateShipmentSummary(
                  _shipmentRequestCount,
                  _underTransitCount,
                  _packagesDeliveredCount,
                  productData
                );
                _listOfProduct.push(productData);
                console.log(productData);
                if (_listOfProduct.length === productIds.length) {
                  storeTransporterDashboardData(
                    _.orderBy(
                      _listOfProduct,
                      (item: IProduct) =>
                        item.productAdvanceInfo.lastModifiedTimestamp,
                      "desc"
                    ),
                    _shipmentRequestCount,
                    _underTransitCount,
                    _packagesDeliveredCount
                  );
                  toggleSpinner();
                }
              })
              .catch((e: any) => {
                toggleSpinner();
                toggleToast("error", e?.errorMessage);
              });
          });
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

  const initiateProductTransfer = (productData: IProduct) => {
    if (contractInstance) {
      toggleSpinner();
      const result: Promise<any> = sendTransaction(
        contractInstance,
        "loadProductBatchForShipmentToRetailer",
        selectedAccount,
        productData.productBasicInfo.productId,
        productData.productAdvanceInfo.retailer
      );
      result
        .then((response) => {
          const ProductBatchUpdatedEvtForTransfer =
            response?.events["UpdatedProductBatchShipmentStatusEvt"][
              "returnValues"
            ];
          let _shipmentRequestCount = shipmentRequestCount;
          let _underTransitCount = underTransitCount;
          let _packagesDeliveredCount = packagesDeliveredCount;
          const _productList = [...products];
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
                  productId: ProductBatchUpdatedEvtForTransfer["productId"],
                },
                productAdvanceInfo: {
                  ...product.productAdvanceInfo,
                  batchStatus: ProductBatchUpdatedEvtForTransfer["status"],
                },
              };
              [
                _shipmentRequestCount,
                _underTransitCount,
                _packagesDeliveredCount,
              ] = populateShipmentSummary(
                _shipmentRequestCount,
                _underTransitCount,
                _packagesDeliveredCount,
                updatedProductBatchForTransfer
              );
              updateTxDatabase(
                response,
                updatedProductBatchForTransfer,
                userListState.users,
                "Package picked for delivery",
                "Package picked for delivery on",
                "transporter"
              );
              return updatedProductBatchForTransfer;
            } else {
              return product;
            }
          });
          storeTransporterDashboardData(
            _updatedList.slice(0),
            _shipmentRequestCount,
            _underTransitCount,
            _packagesDeliveredCount
          );
          toggleToast(
            "success",
            "Package has been picked from warehouse for shipment."
          );
        })
        .catch((e: any) => {
          toggleToast("error", e?.errorMessage);
        })
        .finally(() => {
          toggleSpinner();
          updateDialogStatus(false, false);
        });
    }
  };

  const initiateProductDeliver = (productData: IProduct) => {
    if (contractInstance) {
      toggleSpinner();
      const result: Promise<any> = sendTransaction(
        contractInstance,
        "productBatchDeliveredToRetailer",
        selectedAccount,
        productData.productBasicInfo.productId
      );
      result
        .then((response) => {
          const ProductBatchUpdatedEvtForTransfer =
            response?.events["UpdatedProductBatchShipmentStatusEvt"][
              "returnValues"
            ];
          const _productList = [...products];
          let _shipmentRequestCount = shipmentRequestCount;
          let _underTransitCount = underTransitCount;
          let _packagesDeliveredCount = packagesDeliveredCount;
          const _updatedList = _productList.map((product: IProduct) => {
            if (
              product.productBasicInfo.productId ==
              productData.productBasicInfo.productId
            ) {
              const updatedProductBatchForTransfer: IProduct = {
                ...product,
                productBasicInfo: {
                  ...product.productBasicInfo,
                  productId: ProductBatchUpdatedEvtForTransfer["productId"],
                },
                productAdvanceInfo: {
                  ...product.productAdvanceInfo,
                  batchStatus: ProductBatchUpdatedEvtForTransfer["status"],
                },
              };
              _underTransitCount =
                _underTransitCount > 0
                  ? _underTransitCount - 1
                  : _underTransitCount;
              [
                _shipmentRequestCount,
                _underTransitCount,
                _packagesDeliveredCount,
              ] = populateShipmentSummary(
                _shipmentRequestCount,
                _underTransitCount,
                _packagesDeliveredCount,
                updatedProductBatchForTransfer
              );
              updateTxDatabase(
                response,
                updatedProductBatchForTransfer,
                userListState.users,
                "Package delivered at store",
                "Package delivered at store on",
                "transporter"
              );
              updateTxDatabase(
                response,
                updatedProductBatchForTransfer,
                userListState.users,
                "Package recieved at store",
                "Package recieved at store on",
                "retailer"
              );
              return updatedProductBatchForTransfer;
            } else {
              return product;
            }
          });
          storeTransporterDashboardData(
            _updatedList.slice(0),
            _shipmentRequestCount,
            _underTransitCount,
            _packagesDeliveredCount
          );
          toggleToast(
            "success",
            "Package has been delivered at AAP store successfully."
          );
        })
        .catch((e: any) => {
          toggleToast("error", e?.errorMessage);
        })
        .finally(() => {
          toggleSpinner();
          updateDialogStatus(false, false);
        });
    }
  };

  const cancelShipment = (productData: IProduct) => {
    try {
      toggleSpinner();
      const _reasonEle: HTMLInputElement = document.getElementById(
        "reasonForShipmentCancellation"
      ) as HTMLInputElement;
      if (contractInstance && _reasonEle.value) {
        //cancle product shipment
        const result: Promise<any> = sendTransaction(
          contractInstance,
          "cancelInitiatedPackageShipment",
          selectedAccount,
          productData.productBasicInfo.productId,
          _reasonEle.value
        );

        result
          .then((response) => {
            const ProductBatchUpdatedEvt =
              response?.events["UpdatedProductBatchShipmentStatusEvt"][
                "returnValues"
              ];
            const _productList = [...products];
            let _shipmentRequestCount = shipmentRequestCount;
            let _underTransitCount = underTransitCount;
            let _packagesDeliveredCount = packagesDeliveredCount;
            //get updated product details
            const _updatedList = _productList.map((product: IProduct) => {
              if (
                product.productBasicInfo.productId ==
                productData.productBasicInfo.productId
              ) {
                const updatedProductBatch: IProduct = {
                  ...product,
                  productBasicInfo: {
                    ...product.productBasicInfo,
                    productId: ProductBatchUpdatedEvt["productId"],
                  },
                  productAdvanceInfo: {
                    ...product.productAdvanceInfo,
                    batchStatus: ProductBatchUpdatedEvt["status"],
                    distributor: productData.productAdvanceInfo.distributor,
                    transporter: selectedAccount,
                    reasonForShipmentCancellation: _reasonEle.value,
                  },
                };
                _underTransitCount =
                  _underTransitCount > 0
                    ? _underTransitCount - 1
                    : _underTransitCount;
                [
                  _shipmentRequestCount,
                  _underTransitCount,
                  _packagesDeliveredCount,
                ] = populateShipmentSummary(
                  _shipmentRequestCount,
                  _underTransitCount,
                  _packagesDeliveredCount,
                  updatedProductBatch
                );
                updateTxDatabase(
                  response,
                  updatedProductBatch,
                  userListState.users,
                  "Package shipment canceled",
                  "Package shipment canceled on",
                  "transporter"
                );
                updateTxDatabase(
                  response,
                  updatedProductBatch,
                  userListState.users,
                  "Package shipment canceled by transporter",
                  "Package shipment canceled by transporter on",
                  "retailer"
                );
                return updatedProductBatch;
              } else {
                return product;
              }
            });
            storeTransporterDashboardData(
              [..._updatedList],
              _shipmentRequestCount,
              _underTransitCount,
              _packagesDeliveredCount
            );
            toggleToast("success", "Package shipment process canceled.");
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
        sizeSM: 4,
        label: "Total Shipment Request",
        value: products.length,
        iconComp: (
          <DnsOutlinedIcon fontSize="large" style={{ color: "#3DB2FF" }} />
        ),
      },
      {
        sizeXS: 12,
        sizeSM: 4,
        label: "Packages Under Transit",
        value: underTransitCount,
        iconComp: <LocalShippingIcon fontSize="large" color="primary" />,
      },
      {
        sizeXS: 12,
        sizeSM: 4,
        label: "Packages Delivered",
        value: packagesDeliveredCount,
        iconComp: (
          <AssignmentTurnedInOutlinedIcon
            fontSize="large"
            style={{ color: "#4BB543" }}
          />
        ),
      },
    ];

    return summaryBarList;
  };

  return (
    <div className={classes.root}>
      <SummaryBarComponent summaryBarList={populateDashboardSummaryBarData()} />
      <AddressBarComponent addressBarList={populateUserAddressBarData()} />
      <PanelLayout panelTitle="Shipment Overview">
        <ProductShipmentComponent
          userList={userListState.users}
          initiateTransfer={initiateProductTransfer}
          initiateDeliver={initiateProductDeliver}
          cancelShipment={cancelShipment}
          products={products}
        />
      </PanelLayout>
      {userListState.users.length > 0 && (
        <RegisteredUsersBarComponent
          roles={["distributor", "retailer"]}
          users={populateRoleBasedList(userListState.users) as any}
        />
      )}
    </div>
  );
};

export default withUsers(ShipmentBoardComponent);
