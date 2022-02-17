import React, {
  ChangeEvent,
  FormEventHandler,
  MouseEventHandler,
  ReactNode,
  useContext,
  useRef,
} from "react";
import MTypographyComponent from "../../generic/MTypography";
import TableCell from "@material-ui/core/TableCell";
import {
  PRODUCT_BATCH_STATUS_AT_TRNSPORTER,
  PRODUCT_DIALOG_BTN_CONFIG,
  TRACK_UPDATES,
} from "../../utils/constants";
import MChipComponent from "../../generic/MChip";
import useTableHeaders from "../../hooks/useTableHeaders";
import CheckedIcon from "@material-ui/icons/Check";
import ProductTable from "../../generic/ProductTable";
import { DialogContext } from "../../context/DialogContext";
import { IDialogContext } from "../../models/dialog.interface";
import { IProduct } from "../../models/product.interface";
import MTooltipComponent from "../../generic/MTooltip";
import { IUserInfo } from "../../models/userInfo.interface";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import MConfirmationDialogComponent from "../../generic/MConfirmationDialog";
import MButtonComponent from "../../generic/MButton";
import withActionButton from "../../hoc/withActionButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@material-ui/icons/Close";
import MFormDialogComponent from "../../generic/MFormDialog";
import MTextFieldComponent from "../../generic/MTextField";
import { makeStyles } from "@material-ui/core/styles";
import TransferPolicy from "../../generic/TransferPolicy";
import AgreementImg from "../../assets/images/agreement.png";
import { getContractURL } from "../../utils/helpers";

type ProductShipmentProps = {
  products: Array<IProduct>;
  userList: Array<IUserInfo>;
  initiateTransfer: any;
  initiateDeliver: any;
  cancelShipment: any;
};

const useFormStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: theme.spacing(4),
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
}));

const ProductShipmentComponent = ({
  products,
  userList,
  initiateTransfer,
  initiateDeliver,
  cancelShipment,
}: ProductShipmentProps) => {
  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { dialogStatus, updateDialogStatus } = dialogContext;
  let tableHeaders = useTableHeaders("productShipment");
  const formClasses = useFormStyles();

  const selectedProductRef = useRef<IProduct>({} as IProduct);
  const reasonInputRef = useRef();
  const isDelivered = useRef<Boolean>(false);

  const closeDialog: MouseEventHandler = () => {
    updateDialogStatus(false, false);
  };

  const handleQRCodeEvent: any = (productDetail: any) => {
    updateDialogStatus(
      true,
      false,
      TRACK_UPDATES,
      false,
      productDetail.productId
    );
  };

  const triggerActionDialog = (
    product: IProduct,
    _isDelivered: boolean = false
  ) => {
    selectedProductRef.current = product;
    isDelivered.current = _isDelivered;
    updateDialogStatus(
      false,
      true,
      "Confirmation",
      false,
      "userConfirmationForTransfer"
    );
  };

  const triggerCancellationDialog = (product: IProduct) => {
    selectedProductRef.current = product;
    updateDialogStatus(true, false, "Cancel Shipment", false, "cancelShipment");
  };

  const confirmUserAction = () => {
    isDelivered.current
      ? initiateDeliver(selectedProductRef.current)
      : initiateTransfer(selectedProductRef.current);
  };

  const showDigitalContract = (_orderRequestId: string) => {
    window.open(getContractURL(_orderRequestId), "_blank");
  };

  const populateConfirmDialogFooter = (): ReactNode => {
    return (
      <>
        <MButtonComponent
          variant="outlined"
          label="DisAgree"
          clickHandler={closeDialog}
        />
        <MButtonComponent
          variant="contained"
          label="Agree"
          color="primary"
          clickHandler={() => confirmUserAction()}
        />
      </>
    );
  };

  const populateFormDialogFooter = (isCancel: boolean = false): ReactNode => {
    return (
      <>
        <MButtonComponent
          variant="outlined"
          label="Close"
          clickHandler={closeDialog}
        />
        <MButtonComponent
          {...PRODUCT_DIALOG_BTN_CONFIG(
            "Submit",
            "contained",
            () => cancelShipment(selectedProductRef.current, reasonInputRef),
            "primary"
          )}
        />
      </>
    );
  };

  const populateColumns = (row: IProduct, classes: any) => {
    const _pickComp = withActionButton(
      LocalShippingIcon,
      "Package picked for Shipment",
      row.productAdvanceInfo.batchStatus >= 3
    );
    const _deliverComp = withActionButton(
      CheckedIcon,
      "Delivered at Store",
      row.productAdvanceInfo.batchStatus >= 4
    );

    const _closeComp = withActionButton(
      CloseIcon,
      "Cancel Shipment",
      row.productAdvanceInfo.batchStatus != 3
    );

    const _getInfoIconComp = () => {
      return row.productAdvanceInfo.batchStatus == 2 ? (
        <MTooltipComponent
          title={row.productAdvanceInfo.reasonForShipmentCancellation}
          placement="top"
        >
          <InfoOutlinedIcon
            style={{ width: 20, height: 20, color: "#ffcc00" }}
          />
        </MTooltipComponent>
      ) : null;
    };

    return (
      <>
        <TableCell align="left" className={classes.tableBodyCell}>
          <MChipComponent
            label={
              PRODUCT_BATCH_STATUS_AT_TRNSPORTER[
                row?.productAdvanceInfo.batchStatus
              ]
            }
            size="small"
            textColor="#fc0"
            icon={_getInfoIconComp()}
          />
        </TableCell>
        <TableCell align="left" className={classes.actionLinkCell}>
          {(row.productAdvanceInfo.batchStatus == 1 ||
            row.productAdvanceInfo.batchStatus > 2) && (
            <>
              <_pickComp clickHandler={() => triggerActionDialog(row, false)} />
              <span style={{ paddingLeft: "5px" }}>&nbsp;</span>
              <_deliverComp
                clickHandler={() => triggerActionDialog(row, true)}
              />
            </>
          )}
          {row.productAdvanceInfo.batchStatus == 3 && (
            <>
              <span style={{ paddingLeft: "5px" }}>&nbsp;</span>
              <_closeComp clickHandler={() => triggerCancellationDialog(row)} />
            </>
          )}
        </TableCell>
        <TableCell align="left" className={classes.actionLinkCell}>
          {row.productAdvanceInfo.batchStatus >= 1 && (
            <img
              src={AgreementImg}
              className={formClasses.agreementIcon}
              alt="Agreement Icon"
              onClick={() =>
                showDigitalContract(row.productBasicInfo.orderRequestId)
              }
            />
          )}
        </TableCell>
      </>
    );
  };

  return (
    <>
      <ProductTable
        tableName="Products Shipment (Dist-retailer)"
        tableId="ProductShipmentMDTbl"
        dataList={products}
        userList={userList}
        height="350px"
        tableHeaderIdentifier="productShipment"
        showDistributorCol={true}
        showRetailCol={true}
        getColumns={populateColumns}
        dialogStatus={dialogStatus}
        closeDialog={closeDialog}
        handleQRCodeEvent={handleQRCodeEvent}
      />
      {dialogStatus.dialogId == "cancelShipment" && (
        <MFormDialogComponent
          title={dialogStatus.dialogTitle}
          open={dialogStatus.openFormDialog}
          dialogId="cancelShipmentFormDialog"
          footerButtons={populateFormDialogFooter(true)}
          fullWidth={true}
          maxWidth="sm"
        >
          <div className={formClasses.textFieldBar}>
            <MTextFieldComponent
              required={true}
              id="reasonForShipmentCancellation"
              name="reasonForShipmentCancellation"
              label="Reason For Cancellation"
              variant="outlined"
              multiline={true}
              rows={3}
              classname={formClasses.textField}
            />
          </div>
        </MFormDialogComponent>
      )}
      {dialogStatus.dialogId == "userConfirmationForTransfer" && (
        <MConfirmationDialogComponent
          title={dialogStatus.dialogTitle}
          isOpen={dialogStatus.openConfirmDialog}
          dialogId="userConfirmDialog"
          footerButtons={populateConfirmDialogFooter()}
        >
          <TransferPolicy />
        </MConfirmationDialogComponent>
      )}
    </>
  );
};

export default ProductShipmentComponent;
