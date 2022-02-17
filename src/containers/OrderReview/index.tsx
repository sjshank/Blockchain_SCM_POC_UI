import React, { useContext, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { IWeb3State } from "../../models/web3.interface";
import { Web3Context } from "../../context/Web3Context";
import { SpinnerContext } from "../../context/SpinnerContext";
import { ISpinnerState } from "../../models/spinner.interface";
import { ToastContext } from "../../context/ToastContext";
import {
  getTransactionData,
  sendTransaction,
} from "../../services/contractAPI";
import { IOrder } from "../../models/order.interface";
import _ from "lodash";
import { IOrderRequestContext } from "../../models/orderRequest.interface";
import { OrderRequestContext } from "../../context/OrderRequestContext";
import OrdersComponent from "../../components/Orders";
import { IDialogContext } from "../../models/dialog.interface";
import { DialogContext } from "../../context/DialogContext";
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
      // maxWidth: "180px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    actionLinkCell: {
      fontSize: 11,
      padding: "4px",
      // maxWidth: "250px",
      // width: "250px",
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

const OrderReviewContainer = (props) => {
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
          "getDistributorAssignedOrders",
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

  const updateOrder = (orderFormState: IOrder, isApprove: boolean = false) => {
    try {
      if (contractInstance) {
        toggleSpinner();
        const result: Promise<any> = sendTransaction(
          contractInstance,
          "updateOrder",
          selectedAccount,
          orderFormState.orderRequestId,
          !isApprove
            ? (
                document.getElementById(
                  "reasonForRejection"
                ) as HTMLInputElement
              ).value
            : "",
          isApprove
        );
        result
          .then((response: any) => {
            const OrderRequestEvt =
              response?.events["OrderRequestEvt"]["returnValues"];
            const _orderList = [...orders];
            const _updatedList = _orderList.map((order: IOrder) => {
              if (order.orderRequestId == orderFormState.orderRequestId) {
                const updatedOrder: IOrder = {
                  ...order,
                  orderRequestId: OrderRequestEvt["orderRequestId"],
                  orderStatus: OrderRequestEvt["status"],
                  reasonForOrderCancellation: isApprove
                    ? ""
                    : (
                        document.getElementById(
                          "reasonForRejection"
                        ) as HTMLInputElement
                      ).value,
                };
                if (isApprove) {
                  storeOrderAgreementDetails(
                    response,
                    updatedOrder,
                    props.userList,
                    "Order accepted",
                    "Order accepted on ",
                    "distributor"
                  );
                }
                return updatedOrder;
              } else {
                return order;
              }
            });
            setOrderList(_updatedList);
            toggleSpinner();
            toggleToast(
              "success",
              isApprove
                ? "Digital agreement generated successfully."
                : "Order rejected."
            );
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
        tableHeaderIdentifier="DistributorOrderReview"
        tableName="Distributor Order Review"
        tableId="distributorOrderReview"
        updateOrder={updateOrder}
        showRetailer={true}
      />
    </div>
  );
};

export default OrderReviewContainer;
