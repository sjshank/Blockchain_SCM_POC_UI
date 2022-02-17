import React, { useContext, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import {
  CONTRACT_ADDRESS,
  PACKAGES_SHIPPED_DIST,
  TOTAL_PRODUCTS_DIST,
  YOUR_ADDRESS,
} from "../../../utils/constants";
import { Web3Context } from "../../../context/Web3Context";
import { IWeb3State } from "../../../models/web3.interface";
import { ISpinnerState } from "../../../models/spinner.interface";
import { SpinnerContext } from "../../../context/SpinnerContext";
import { IProduct } from "../../../models/product.interface";
import DnsOutlinedIcon from "@material-ui/icons/DnsOutlined";
import ContactsOutlinedIcon from "@material-ui/icons/ContactsOutlined";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import {
  populateRoleBasedList,
  populateStoreSummary,
} from "../../../utils/helpers";
import { IDistributorContext } from "../../../models/distributor.interface";
import { DistributorContext } from "../../../context/DistributorContext";
import { ISummaryBar } from "../../../models/summarybar.interface";
import SummaryBarComponent from "../../../components/SummaryBar";
import { IAddressBar } from "../../../models/addressbar.interface";
import AddressBarComponent from "../../../components/AddressBar";
import {
  getTransactionData,
  sendTransaction,
} from "../../../services/contractAPI";
import { ToastContext } from "../../../context/ToastContext";
import { DialogContext } from "../../../context/DialogContext";
import { IDialogContext } from "../../../models/dialog.interface";
import RegisteredUsersBarComponent from "../../../components/RegisteredUsersBar";
import PanelLayout from "../../../layout/Panel";
import withUsers from "../../../hoc/withUsers";
import useProductDetails from "../../../hooks/useProductDetails";
import RegisteredProductsComponent from "../../../components/RegisteredProducts";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import {
  storeOrderAgreementDetails,
  updateTxDatabase,
} from "../../../services/firebaseAPI";
import _ from "lodash";
import OrderReviewContainer from "../../OrderReview";
import { OrderRequestContextProvider } from "../../../context/OrderRequestContext";
import useOrderDetails from "../../../hooks/useOrderDetails";
import { IOrder } from "../../../models/order.interface";

type DistributorDashboardProps = {};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "15px",
      marginBottom: "15px",
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      borderRadius: "0px",
    },
    registeredUserRoot: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      minHeight: "280px",
    },
    label: {
      display: "flex",
      justifyContent: "start",
      textAlign: "left",
      // color: "#053742",
    },
    icon: {
      textAlign: "left",
      marginRight: "4px",
    },
    createUserBtn: {
      float: "right",
      marginTop: "-35px",
      color: "rgb(41, 187, 137)",
      border: "1px solid rgb(41, 187, 137)",
      fontWeight: 600,
    },
  })
);

const DistributionBoardComponent = (props: any) => {
  const classes = useStyles();
  const loadProductDetails = useProductDetails();
  const loadOrderDetails = useOrderDetails();
  const userListState = props["userList"];

  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;

  const spinnerContext = useContext<ISpinnerState>(SpinnerContext);
  const { toggleSpinner } = spinnerContext;

  const distributorContext =
    useContext<IDistributorContext>(DistributorContext);
  const {
    batchesShippedCount,
    batchesRejectedCount,
    batchesApprovedCount,
    products,
    storeDistributorDashboardData,
    setProductList,
  } = distributorContext;

  const toastContext = useContext<any>(ToastContext);
  const { toggleToast } = toastContext;

  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { updateDialogStatus } = dialogContext;

  /***
   *
   * Below code is added only for testing purpose. Below method tested successfully
   */
  useEffect(() => {
    try {
      if (contractInstance && products.length === 0) {
        toggleSpinner();
        //Get all the registered product Ids
        const result = getTransactionData(
          contractInstance,
          "getAllRegisteredProductBatches",
          selectedAccount,
          selectedAccount
        );
        result
          .then((productIds: any) => {
            let _batchesRecievedCount = 0;
            let _batchesRejectedCount = 0;
            let _batchesApprovedCount = 0;
            let _totalBatches = 0;
            let _listOfRegProduct: IProduct[] = [];
            if (productIds.length == 0) toggleSpinner();
            //Retrieve product details for each product id
            productIds.forEach((prodId: any) => {
              loadProductDetails(prodId).then((res: any) => {
                const productData: IProduct = {
                  ...res,
                  ...res.productBasicInfo,
                  ...res.productAdvanceInfo,
                };
                productData.productAdvanceInfo.batchStatus == 1 ||
                productData.productAdvanceInfo.batchStatus > 2
                  ? _totalBatches++
                  : null;
                _listOfRegProduct.push(productData);
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
                if (_listOfRegProduct.length === productIds.length) {
                  storeDistributorDashboardData(
                    _totalBatches,
                    _batchesRejectedCount,
                    _batchesApprovedCount,
                    _.orderBy(
                      _listOfRegProduct,
                      (item: IProduct) =>
                        item.productAdvanceInfo.lastModifiedTimestamp,
                      "desc"
                    )
                  );
                  toggleSpinner();
                }
              });
            });
          })
          .catch((e: any) => {
            toggleSpinner();
            toggleToast("error", e?.errorMessage);
          })
          .finally(() => {});
      }
    } catch (e: any) {
      toggleSpinner();
      toggleToast("error", e?.errorMessage);
    }
  }, []);

  const registerProduct = (params: IProduct) => {
    if (contractInstance) {
      console.log(params);
      toggleSpinner();
      //create new product batch
      const result: Promise<any> = sendTransaction(
        contractInstance,
        "registerProductBatch",
        selectedAccount,
        params.productBasicInfo.productName,
        params.productBasicInfo.productDesc,
        params.productBasicInfo.warehouseLoc,
        params.productBasicInfo.quantity,
        params.productBasicInfo.price,
        parseInt(params.productBasicInfo.quantity) *
          parseInt(params.productBasicInfo.price),
        params.productAdvanceInfo.manufacturerName,
        params.productAdvanceInfo.manufacturerLoc,
        params.productAdvanceInfo.transporter,
        params.productAdvanceInfo.retailer,
        params.productBasicInfo.orderRequestId
      );

      result
        .then(async (response) => {
          const ProductBatchUpdatedEvt =
            response?.events["ProductBatchUpdatedEvt"]["returnValues"];
          const newProductBatch: IProduct = {
            ...params,
            productBasicInfo: {
              ...params.productBasicInfo,
              productId: ProductBatchUpdatedEvt["productId"],
            },
            productAdvanceInfo: {
              ...params.productAdvanceInfo,
              batchStatus: ProductBatchUpdatedEvt["status"],
              distributor: selectedAccount,
            },
          };
          const OrderStatusEvt =
            response?.events["OrderStatusEvt"]["returnValues"];
          if (OrderStatusEvt) {
            newProductBatch.productBasicInfo.orderRequestId =
              OrderStatusEvt["orderRequestId"];
            newProductBatch.productBasicInfo.orderSubmissionDate =
              OrderStatusEvt["submissionTimestamp"];
            newProductBatch.productAdvanceInfo.orderModifiedDate =
              OrderStatusEvt["orderModifiedDate"];
            newProductBatch.productAdvanceInfo.orderStatus =
              OrderStatusEvt["orderStatus"];
            updateTxDatabase(
              response,
              newProductBatch,
              userListState.users,
              "Product registered in the system",
              "Product registered in the system on",
              "distributor",
              true
            );
          }
          products.unshift(newProductBatch);
          setProductList(products.slice(0));
          toggleToast("success", "Product registered successfully.");
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

  // const updateProduct = (params: IProduct) => {
  //   if (contractInstance) {
  //     toggleSpinner();
  //     //create new product batch
  //     const result: Promise<any> = sendTransaction(
  //       contractInstance,
  //       "updateProductBatch",
  //       selectedAccount,
  //       params.productBasicInfo.productId,
  //       params.productBasicInfo.productName,
  //       params.productBasicInfo.productDesc,
  //       params.productBasicInfo.warehouseLoc,
  //       params.productBasicInfo.quantity,
  //       params.productBasicInfo.price,
  //       params.productBasicInfo.totalPrice,
  //       params.productAdvanceInfo.manufacturerName,
  //       params.productAdvanceInfo.manufacturerLoc,
  //       params.productAdvanceInfo.transporter,
  //       params.productAdvanceInfo.retailer,
  //       params.productBasicInfo.orderRequestId
  //     );

  //     result
  //       .then((response) => {
  //         const ProductBatchUpdatedEvt =
  //           response?.events["ProductBatchUpdatedEvt"]["returnValues"];
  //         let _batchesRecievedCount = 0;
  //         let _batchesRejectedCount = 0;
  //         let _batchesApprovedCount = 0;
  //         const _productList = [...products];
  //         //get updated product details
  //         const _updatedList = _productList.map((product: IProduct) => {
  //           if (
  //             product.productBasicInfo.productId ==
  //             params.productBasicInfo.productId
  //           ) {
  //             const updatedProductBatch: IProduct = {
  //               ...params,
  //               productBasicInfo: {
  //                 ...params.productBasicInfo,
  //                 productId: ProductBatchUpdatedEvt["productId"],
  //               },
  //               productAdvanceInfo: {
  //                 ...params.productAdvanceInfo,
  //                 batchStatus: ProductBatchUpdatedEvt["status"],
  //                 distributor: selectedAccount,
  //               },
  //             };
  //             [
  //               _batchesRecievedCount,
  //               _batchesRejectedCount,
  //               _batchesApprovedCount,
  //             ] = populateStoreSummary(
  //               _batchesRecievedCount,
  //               _batchesRejectedCount,
  //               _batchesApprovedCount,
  //               updatedProductBatch
  //             );
  //             updateTxDatabase(
  //               response,
  //               updatedProductBatch,
  //               userListState.users,
  //               "Product details updated",
  //               "Product details updated on",
  //               "distributor"
  //             );
  //             return updatedProductBatch;
  //           } else {
  //             [
  //               _batchesRecievedCount,
  //               _batchesRejectedCount,
  //               _batchesApprovedCount,
  //             ] = populateStoreSummary(
  //               _batchesRecievedCount,
  //               _batchesRejectedCount,
  //               _batchesApprovedCount,
  //               product
  //             );
  //             return product;
  //           }
  //         });
  //         storeDistributorDashboardData(
  //           _updatedList.length,
  //           _batchesRejectedCount,
  //           _batchesApprovedCount,
  //           _updatedList
  //         );
  //         toggleToast("success", "Product updated successfully.");
  //       })
  //       .catch((e: any) => {
  //         toggleToast("error", e?.errorMessage);
  //       })
  //       .finally(() => {
  //         toggleSpinner();
  //         updateDialogStatus(false, false);
  //       });
  //   }
  // };

  const initiateProductShipment = (productData: IProduct) => {
    if (contractInstance) {
      toggleSpinner();
      //Initiate product shipment
      const result: Promise<any> = sendTransaction(
        contractInstance,
        "initiateProductShipment",
        selectedAccount,
        productData.productBasicInfo.productId,
        productData.productAdvanceInfo.transporter
      );
      result
        .then((response) => {
          const ProductBatchUpdatedEvt =
            response?.events["ProductBatchUpdatedEvt"]["returnValues"];
          let _batchesRecievedCount = 0;
          let _batchesRejectedCount = 0;
          let _batchesApprovedCount = 0;
          let _totalBatches = batchesShippedCount;
          const _productList = [...products];
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
                  distributor: selectedAccount,
                },
              };
              _totalBatches = _totalBatches + 1;
              [
                _batchesRecievedCount,
                _batchesRejectedCount,
                _batchesApprovedCount,
              ] = populateStoreSummary(
                _batchesRecievedCount,
                _batchesRejectedCount,
                _batchesApprovedCount,
                updatedProductBatch
              );
              updateTxDatabase(
                response,
                updatedProductBatch,
                userListState.users,
                "Shipment initiated",
                "Shipment initiated on",
                "distributor"
              );
              updateTxDatabase(
                response,
                updatedProductBatch,
                userListState.users,
                "Shipment request recieved",
                "Shipment request recieved",
                "transporter"
              );
              return updatedProductBatch;
            } else {
              [
                _batchesRecievedCount,
                _batchesRejectedCount,
                _batchesApprovedCount,
              ] = populateStoreSummary(
                _batchesRecievedCount,
                _batchesRejectedCount,
                _batchesApprovedCount,
                product
              );
              return product;
            }
          });
          storeDistributorDashboardData(
            _totalBatches,
            _batchesRejectedCount,
            _batchesApprovedCount,
            _updatedList
          );
          toggleToast("success", "Product shipment initiated successfully.");
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
      if (
        contractInstance &&
        productData.productAdvanceInfo.reasonForShipmentCancellation !== ""
      ) {
        toggleSpinner();
        //cancle product shipment
        const result: Promise<any> = sendTransaction(
          contractInstance,
          "cancelInitiatedShipment",
          selectedAccount,
          productData.productBasicInfo.productId,
          productData.productAdvanceInfo.reasonForShipmentCancellation
        );

        result
          .then((response) => {
            const ProductBatchUpdatedEvt =
              response?.events["ProductBatchUpdatedEvt"]["returnValues"];
            let _batchesRecievedCount = 0;
            let _batchesRejectedCount = 0;
            let _batchesApprovedCount = 0;
            let _totalBatches = batchesShippedCount;
            const _productList = [...products];
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
                    distributor: selectedAccount,
                    reasonForShipmentCancellation:
                      productData.productAdvanceInfo
                        .reasonForShipmentCancellation,
                  },
                };
                _totalBatches = _totalBatches - 1;
                [
                  _batchesRecievedCount,
                  _batchesRejectedCount,
                  _batchesApprovedCount,
                ] = populateStoreSummary(
                  _batchesRecievedCount,
                  _batchesRejectedCount,
                  _batchesApprovedCount,
                  updatedProductBatch
                );
                updateTxDatabase(
                  response,
                  updatedProductBatch,
                  userListState.users,
                  "Shipment canceled",
                  "Shipment canceled on",
                  "distributor"
                );
                updateTxDatabase(
                  response,
                  updatedProductBatch,
                  userListState.users,
                  "Shipment request canceled",
                  "Shipment request canceled on",
                  "transporter"
                );
                return updatedProductBatch;
              } else {
                [
                  _batchesRecievedCount,
                  _batchesRejectedCount,
                  _batchesApprovedCount,
                ] = populateStoreSummary(
                  _batchesRecievedCount,
                  _batchesRejectedCount,
                  _batchesApprovedCount,
                  product
                );
                return product;
              }
            });
            storeDistributorDashboardData(
              _totalBatches,
              _batchesRejectedCount,
              _batchesApprovedCount,
              _updatedList
            );
            toggleToast("success", "Product shipment process canceled.");
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
        label: TOTAL_PRODUCTS_DIST,
        value: products.length,
        iconComp: (
          <DnsOutlinedIcon fontSize="large" style={{ color: "#3DB2FF" }} />
        ),
      },
      {
        sizeXS: 12,
        sizeSM: 3,
        label: PACKAGES_SHIPPED_DIST,
        value: batchesShippedCount,
        iconComp: <LocalShippingIcon fontSize="large" color="primary" />,
      },
      {
        sizeXS: 12,
        sizeSM: 3,
        label: "Packages Approved",
        value: batchesApprovedCount,
        iconComp: <ThumbUpIcon fontSize="large" style={{ color: "#006400" }} />,
      },
      {
        sizeXS: 12,
        sizeSM: 3,
        label: "Packages Rejected",
        value: batchesRejectedCount,
        iconComp: (
          <ThumbDownIcon fontSize="large" style={{ color: "#565F5F" }} />
        ),
      },
    ];
    return summaryBarList;
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

  return (
    <div className={classes.root}>
      <SummaryBarComponent summaryBarList={populateDashboardSummaryBarData()} />
      <AddressBarComponent addressBarList={populateUserAddressBarData()} />
      <PanelLayout panelTitle="Batches Overview">
        <RegisteredProductsComponent
          userList={userListState.users}
          products={products}
          registerNewProductBatch={registerProduct}
          // updateProductBatch={updateProduct}
          initiateShipment={initiateProductShipment}
          cancelShipment={cancelShipment}
        />
      </PanelLayout>
      <PanelLayout panelTitle="Orders Overview">
        <OrderRequestContextProvider>
          <OrderReviewContainer userList={userListState.users} />
        </OrderRequestContextProvider>
      </PanelLayout>
      {userListState.users.length > 0 && (
        <RegisteredUsersBarComponent
          roles={["retailer", "transporter"]}
          users={populateRoleBasedList(userListState.users) as any}
        />
      )}
    </div>
  );
};

export default withUsers(DistributionBoardComponent);
