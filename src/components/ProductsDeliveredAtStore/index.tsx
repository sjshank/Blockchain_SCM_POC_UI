import React, { MouseEventHandler, ReactNode, useContext, useRef } from "react";
import MTypographyComponent from "../../generic/MTypography";
import TableCell from "@material-ui/core/TableCell";
import {
  PRODUCT_BATCH_STATUS_AT_STORE,
  PRODUCT_DIALOG_BTN_CONFIG,
  TRACK_UPDATES,
} from "../../utils/constants";
import MChipComponent from "../../generic/MChip";
import useTableHeaders from "../../hooks/useTableHeaders";
import { makeStyles } from "@material-ui/core/styles";
import ProductTable from "../../generic/ProductTable";
import { DialogContext } from "../../context/DialogContext";
import { IDialogContext } from "../../models/dialog.interface";
import { IProduct } from "../../models/product.interface";
import MTooltipComponent from "../../generic/MTooltip";
import { IUserInfo } from "../../models/userInfo.interface";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import MConfirmationDialogComponent from "../../generic/MConfirmationDialog";
import MButtonComponent from "../../generic/MButton";
import withActionButton from "../../hoc/withActionButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MFormDialogComponent from "../../generic/MFormDialog";
import MTextFieldComponent from "../../generic/MTextField";
import TransferPolicy from "../../generic/TransferPolicy";

type ProductsDeliveredProps = {
  products: Array<IProduct>;
  userList: Array<IUserInfo>;
  updateProductStatus: any;
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
}));

const ProductsDeliveredAtStoreComponent = ({
  products,
  userList,
  updateProductStatus,
}: ProductsDeliveredProps) => {
  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { dialogStatus, updateDialogStatus } = dialogContext;
  let tableHeaders = useTableHeaders("productsDelivered");
  const formClasses = useFormStyles();

  const selectedProductRef = useRef<IProduct>();
  const isApproved = useRef<Boolean>(false);

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
    _isApproved: boolean = false
  ) => {
    selectedProductRef.current = product;
    isApproved.current = _isApproved;
    updateDialogStatus(
      _isApproved ? false : true,
      _isApproved ? true : false,
      _isApproved ? "Confirmation" : "Reject Package",
      false,
      _isApproved ? "confirmationForDelieveredPkg" : "rejectPackage"
    );
  };

  const populateColumns = (row: IProduct, classes: any) => {
    const _rejectComp = withActionButton(
      ThumbDownIcon,
      "Reject package",
      row.productAdvanceInfo.batchStatus > 4
    );
    const _approveComp = withActionButton(
      ThumbUpIcon,
      "Approve package",
      row.productAdvanceInfo.batchStatus > 4
    );

    const _getInfoIconComp = () => {
      return row.productAdvanceInfo.batchStatus == 5 ? (
        <MTooltipComponent
          title={row.productAdvanceInfo.reasonForPackageRejection}
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
              PRODUCT_BATCH_STATUS_AT_STORE[row?.productAdvanceInfo.batchStatus]
            }
            size="small"
            textColor="#fc0"
            icon={_getInfoIconComp()}
          />
        </TableCell>
        <TableCell align="left" className={classes.actionLinkCell}>
          {row.productAdvanceInfo.batchStatus == 4 && (
            <>
              <_rejectComp
                clickHandler={() => triggerActionDialog(row, false)}
              />
              <span style={{ paddingLeft: "5px" }}>&nbsp;</span>
              <_approveComp
                clickHandler={() => triggerActionDialog(row, true)}
              />
            </>
          )}
        </TableCell>
      </>
    );
  };

  const populateDialogFooter = (isRejected: boolean = false): ReactNode => {
    return (
      <>
        <MButtonComponent
          variant="outlined"
          label={isRejected ? "Cancel" : "DisAgree"}
          clickHandler={closeDialog}
        />
        <MButtonComponent
          variant="contained"
          label={isRejected ? "Submit" : "Agree"}
          color="primary"
          clickHandler={() =>
            updateProductStatus(selectedProductRef.current, !isRejected)
          }
        />
      </>
    );
  };

  return (
    <>
      <ProductTable
        tableName="Products Delivered At Store"
        tableId="ProductDeliveredTbl"
        dataList={products}
        userList={userList}
        height="350px"
        tableHeaderIdentifier="productsDelivered"
        showDistributorCol={true}
        showShipperCol={true}
        getColumns={populateColumns}
        dialogStatus={dialogStatus}
        closeDialog={closeDialog}
        handleQRCodeEvent={handleQRCodeEvent}
      />

      {dialogStatus.dialogId == "rejectPackage" && (
        <MFormDialogComponent
          title={dialogStatus.dialogTitle}
          open={dialogStatus.openFormDialog}
          dialogId="rejectPackageDialog"
          footerButtons={populateDialogFooter(true)}
          fullWidth={true}
          maxWidth="sm"
        >
          <div className={formClasses.textFieldBar}>
            <MTextFieldComponent
              required={true}
              id="reasonForRejection"
              name="reasonForRejection"
              label="Reason For Rejection"
              variant="outlined"
              multiline={true}
              rows={3}
              classname={formClasses.textField}
            />
          </div>
        </MFormDialogComponent>
      )}

      {dialogStatus.dialogId == "confirmationForDelieveredPkg" && (
        <MConfirmationDialogComponent
          title={dialogStatus.dialogTitle}
          isOpen={dialogStatus.openConfirmDialog}
          dialogId="userConfirmDialog"
          footerButtons={populateDialogFooter(false)}
        >
          <TransferPolicy />
        </MConfirmationDialogComponent>
      )}
    </>
  );
};

export default ProductsDeliveredAtStoreComponent;
