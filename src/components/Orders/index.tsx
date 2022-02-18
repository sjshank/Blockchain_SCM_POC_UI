import React, {
  MouseEventHandler,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { createStyles, makeStyles, Theme, Grid } from "@material-ui/core";
import { IDialogContext } from "../../models/dialog.interface";
import { DialogContext } from "../../context/DialogContext";
import OrderTable from "../../generic/OrderTable";
import { IOrder } from "../../models/order.interface";
import TableCell from "@material-ui/core/TableCell";
import MChipComponent from "../../generic/MChip";
import MTooltipComponent from "../../generic/MTooltip";
import withActionButton from "../../hoc/withActionButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IOrderRequestContext } from "../../models/orderRequest.interface";
import { OrderRequestContext } from "../../context/OrderRequestContext";
import {
  ORDER_REQUEST_STATUS_AT_DIST,
  ORDER_REQUEST_STATUS_AT_RET,
  PRODUCT_DIALOG_BTN_CONFIG,
} from "../../utils/constants";
import { IUserInfo, IUserInfoContext } from "../../models/userInfo.interface";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CloseIcon from "@material-ui/icons/Close";
import MFormDialogComponent from "../../generic/MFormDialog";
import MTextFieldComponent from "../../generic/MTextField";
import MButtonComponent from "../../generic/MButton";
import OrderFormComponent from "../OrderForm";
import { ORDER_STATE, reducer } from "../../containers/OrderRequest/reducer";
import { UserInfoContext } from "../../context/UserContext";
import AgreementImg from "../../assets/images/agreement.png";
import { useHistory } from "react-router";
import { getContractURL } from "../../utils/helpers";

type OrdersProps = {
  userList: IUserInfo[];
  tableHeaderIdentifier: string;
  tableName: string;
  tableId: string;
  updateOrder: (orderFormState: IOrder, isApprove: boolean) => void;
  showRetailer?: boolean;
  showDistributor?: boolean;
};

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
    textFieldBar: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(3),
    },
    textField: {
      width: "100%",
    },
    select: {
      width: "100%",
    },
    agreementIcon: {
      width: 45,
      height: 45,
      cursor: "pointer",
    },
  })
);

const OrdersComponent = ({
  userList,
  tableHeaderIdentifier,
  tableName,
  tableId,
  updateOrder,
  showRetailer,
  showDistributor,
}: OrdersProps) => {
  const classes = useStyles();
  const history = useHistory();
  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { updateDialogStatus, dialogStatus } = dialogContext;

  const userInfoContext = useContext<IUserInfoContext>(UserInfoContext);
  const { userInfo } = userInfoContext;

  const orderRequestContext =
    useContext<IOrderRequestContext>(OrderRequestContext);
  const { orders } = orderRequestContext;

  const closeDialog: MouseEventHandler = () => {
    updateDialogStatus(false, false);
  };

  const [orderFormState, dispatchOrderFormStateAction] = useReducer(reducer, {
    ...ORDER_STATE,
  });

  const showOrderReqDialog: any = () => {
    dispatchOrderFormStateAction({
      type: "RESET",
    });
    updateDialogStatus(
      true,
      false,
      "New Order Request",
      false,
      "orderRequestForm"
    );
  };

  const triggerActionDialog = (order: IOrder) => {
    dispatchOrderFormStateAction({
      type: "SET_ORDER_INFO",
      data: order,
      value: order.retailer,
    });
    updateDialogStatus(true, false, "Reject Order", false, "rejectOrder");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchOrderFormStateAction({
      type: "SET_VALUE",
      key: event.target.name,
      value: event.target.value,
    });
  };

  const validateStatus = (statusArr: number[], status: string) => {
    return statusArr.indexOf(parseInt(status)) > -1;
  };

  const showDigitalContract = (order: IOrder) => {
    history.push("/contract/" + order.orderRequestId);
  };

  const populateColumns = (order: IOrder) => {
    const _getInfoIconComp = (order: IOrder) => {
      return order.orderStatus == 1 ? (
        <MTooltipComponent
          title={order.reasonForOrderCancellation}
          placement="top"
        >
          <InfoOutlinedIcon
            style={{ width: 20, height: 20, color: "#ffcc00" }}
          />
        </MTooltipComponent>
      ) : null;
    };

    const _rejectComp = withActionButton(
      ThumbDownIcon,
      "Reject Order",
      order.orderStatus > 0
    );
    const _approveComp = withActionButton(
      ThumbUpIcon,
      "Accept Order",
      order.orderStatus > 0
    );
    const _closeComp = withActionButton(
      CloseIcon,
      "Cancel Order",
      validateStatus([1, 4, 5], order.orderStatus)
    );
    return (
      <React.Fragment key={order.orderRequestId + order.productName}>
        <TableCell align="left" className={classes.tableBodyCell}>
          <MChipComponent
            label={
              userInfo.userRoleName == "distributor"
                ? ORDER_REQUEST_STATUS_AT_DIST[order.orderStatus]
                : ORDER_REQUEST_STATUS_AT_RET[order.orderStatus]
            }
            size="small"
            icon={_getInfoIconComp(order)}
            textColor="#fc0"
          ></MChipComponent>
        </TableCell>
        <TableCell align="left" className={classes.actionLinkCell}>
          {userInfo.userRoleName == "distributor" && order.orderStatus == 0 && (
            <>
              <_rejectComp clickHandler={() => triggerActionDialog(order)} />
              <span style={{ paddingLeft: "5px" }}>&nbsp;</span>
              <_approveComp clickHandler={() => updateOrder(order, true)} />
            </>
          )}
          {userInfo.userRoleName == "retailer" &&
            validateStatus([0, 2], order.orderStatus) && (
              <>
                <span style={{ paddingLeft: "5px" }}>&nbsp;</span>
                <_closeComp />
              </>
            )}
        </TableCell>
        <TableCell align="left" className={classes.actionLinkCell}>
          {order.orderStatus >= 2 && (
            <img
              src={AgreementImg}
              className={classes.agreementIcon}
              alt="Agreement Icon"
              onClick={() => showDigitalContract(order)}
            />
          )}
        </TableCell>
      </React.Fragment>
    );
  };

  const populateDialogFooter = (isRejected: boolean = false): ReactNode => {
    return (
      <>
        <MButtonComponent
          variant="outlined"
          label="Cancel"
          clickHandler={closeDialog}
        />
        <MButtonComponent
          {...PRODUCT_DIALOG_BTN_CONFIG(
            "Submit",
            "contained",
            () => updateOrder(orderFormState, !isRejected),
            "primary"
          )}
        />
      </>
    );
  };

  return (
    <>
      {userInfo.userRoleName == "retailer" && (
        <MButtonComponent
          variant="contained"
          color="primary"
          label="Place Your Order"
          classname={classes.addProductBtn}
          clickHandler={showOrderReqDialog}
        />
      )}
      <OrderTable
        dataList={orders ? orders : []}
        userList={userList}
        tableHeaderIdentifier={tableHeaderIdentifier}
        tableName={tableName}
        tableId={tableId}
        getColumns={populateColumns}
        height="350px"
        showRetailCol={showRetailer}
        showDistributorCol={showDistributor}
      />
      {dialogStatus.dialogId == "rejectOrder" && (
        <MFormDialogComponent
          title={dialogStatus.dialogTitle}
          open={dialogStatus.openFormDialog}
          dialogId="rejectPackageDialog"
          footerButtons={populateDialogFooter(true)}
          fullWidth={true}
          maxWidth="sm"
        >
          <div className={classes.textFieldBar}>
            <MTextFieldComponent
              required={true}
              id="reasonForRejection"
              name="reasonForRejection"
              label="Reason For Rejection"
              variant="outlined"
              multiline={true}
              rows={3}
              classname={classes.textField}
            />
          </div>
        </MFormDialogComponent>
      )}
      {dialogStatus.dialogId == "orderRequestForm" && (
        <MFormDialogComponent
          title={dialogStatus.dialogTitle}
          open={dialogStatus.openFormDialog}
          dialogId="rawMaterialFormDialog"
          footerButtons={populateDialogFooter(false)}
          fullWidth={true}
          maxWidth="sm"
        >
          <OrderFormComponent
            orderFormState={orderFormState}
            handleInputChange={handleInputChange}
            userList={userList}
          />
        </MFormDialogComponent>
      )}
    </>
  );
};

export default OrdersComponent;
