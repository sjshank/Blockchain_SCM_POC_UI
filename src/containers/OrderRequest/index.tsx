import React, { useContext, useEffect } from "react";
import { createStyles, makeStyles, Theme, Grid } from "@material-ui/core";
import { IWeb3State } from "../../models/web3.interface";
import { Web3Context } from "../../context/Web3Context";
import { SpinnerContext } from "../../context/SpinnerContext";
import { ISpinnerState } from "../../models/spinner.interface";
import { ToastContext } from "../../context/ToastContext";
import { IDialogContext } from "../../models/dialog.interface";
import { DialogContext } from "../../context/DialogContext";
import {
  getTransactionData,
  sendTransaction,
} from "../../services/contractAPI";
import { IOrder } from "../../models/order.interface";
import { IOrderRequestContext } from "../../models/orderRequest.interface";
import { OrderRequestContext } from "../../context/OrderRequestContext";
import OrdersComponent from "../../components/Orders";
import _ from "lodash";
import useOrderDetails from "../../hooks/useOrderDetails";
import { storeOrderAgreementDetails } from "../../services/firebaseAPI";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "15px",
      marginBottom: "15px",
    },
    tableBodyCell: {
      fontSize: 11,
      padding: "4px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    actionLinkCell: {
      fontSize: 11,
      padding: "4px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    addProductBtn: {
      float: "right",
      marginTop: "-25px",
      fontWeight: 600,
      marginBottom: "15px",
    },
    registerSubtitleModal: {
      paddingBottom: theme.spacing(1),
    },
  })
);

const OrderRequestContainer: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const loadOrderDetails = useOrderDetails();
  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;

  const spinnerContext = useContext<ISpinnerState>(SpinnerContext);
  const { toggleSpinner } = spinnerContext;

  const toastContext = useContext<any>(ToastContext);
  const { toggleToast } = toastContext;

  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { updateDialogStatus } = dialogContext;

  const orderRequestContext =
    useContext<IOrderRequestContext>(OrderRequestContext);
  const { orders, setOrderList } = orderRequestContext;

  useEffect(() => {
    try {
      if (contractInstance) {
        toggleSpinner();
        const orderResult = getTransactionData(
          contractInstance,
          "getRetailerSubmittedOrders",
          selectedAccount,
          selectedAccount
        );
        orderResult
          .then((orderIds: any) => {
            let _listOfOrder: IOrder[] = [];
            if (orderIds.length == 0) toggleSpinner();
            orderIds.forEach((ordId: any) => {
              loadOrderDetails(ordId).then((res: any) => {
                const orderData: IOrder = {
                  ...res,
                };
                _listOfOrder.push(orderData);
                if (_listOfOrder.length === orderIds.length) {
                  setOrderList(
                    _.orderBy(
                      _listOfOrder,
                      (item: IOrder) => item.orderModifiedDate,
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
          });
      }
    } catch (e: any) {
      toggleSpinner();
      toggleToast("error", e?.errorMessage);
    }
  }, []);

  const submitNewOrder = (orderFormState: IOrder, isApprove?: boolean) => {
    try {
      if (contractInstance) {
        toggleSpinner();
        const result: Promise<any> = sendTransaction(
          contractInstance,
          "submitOrder",
          selectedAccount,
          orderFormState.productName,
          orderFormState.productDesc,
          orderFormState.manufacturerDetail,
          orderFormState.quantity,
          orderFormState.notes,
          orderFormState.distributor
        );
        result
          .then((response: any) => {
            const OrderRequestEvt =
              response?.events["OrderRequestEvt"]["returnValues"];
            orderFormState.orderRequestId = OrderRequestEvt["orderRequestId"];
            orderFormState.orderStatus = OrderRequestEvt["status"];
            orderFormState.retailer = selectedAccount;
            const _updatedList = [...orders];
            _updatedList.unshift(orderFormState);
            setOrderList(_updatedList);
            toggleToast("success", "Order placed successfully.");
            toggleSpinner();
            if (isApprove) {
              storeOrderAgreementDetails(
                response,
                orderFormState,
                props.userList,
                "Order submitted",
                "Order submitted on ",
                "retailer"
              );
            }
          })
          .catch((e: any) => {
            toggleSpinner();
            toggleToast("error", e?.errorMessage);
          })
          .finally(() => {
            updateDialogStatus(false, false);
          });
      }
    } catch (e: any) {
      toggleSpinner();
      toggleToast("error", e?.errorMessage);
    }
  };

  return (
    <div className={classes.root}>
      <OrdersComponent
        userList={props.userList}
        tableHeaderIdentifier="RetailerOrderRequest"
        tableName="Retailer Order Requests"
        tableId="retailerOrderRequests"
        updateOrder={submitNewOrder}
        showRetailer={false}
        showDistributor={true}
      />
    </div>
  );
};

export default OrderRequestContainer;
