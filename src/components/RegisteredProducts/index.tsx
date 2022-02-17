import React, {
  MouseEventHandler,
  ReactNode,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";
import TableCell from "@material-ui/core/TableCell";
import { IUserInfo, IUserInfoContext } from "../../models/userInfo.interface";
import { IOrder } from "../../models/order.interface";
import MTooltipComponent from "../../generic/MTooltip";
import MTypographyComponent from "../../generic/MTypography";
import {
  PRODUCT_BATCH_STATUS_AT_DIST,
  PRODUCT_DIALOG_BTN_CONFIG,
  TRACK_UPDATES,
} from "../../utils/constants";
import useTableHeaders from "../../hooks/useTableHeaders";
import MChipComponent from "../../generic/MChip";
import { IProduct, IProductBasicInfo } from "../../models/product.interface";
import ProductTable from "../../generic/ProductTable";
import MFormDialogComponent from "../../generic/MFormDialog";
import { DialogContext } from "../../context/DialogContext";
import { IDialogContext } from "../../models/dialog.interface";
import MButtonComponent from "../../generic/MButton";
import { PRODUCT_STATE, reducer } from "./reducer";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import ProductFormComponent from "./ProductForm";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import MConfirmationDialogComponent from "../../generic/MConfirmationDialog";
import CancellationFormComponent from "./CancellationForm";
import withActionButton from "../../hoc/withActionButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TransferPolicy from "../../generic/TransferPolicy";
import useOrderDetails from "../../hooks/useOrderDetails";
import { OrderRequestContextProvider } from "../../context/OrderRequestContext";
import { UserInfoContext } from "../../context/UserContext";

type RegisteredProductProps = {
  products: Array<IProduct>;
  userList: Array<IUserInfo>;
  isReadonly?: boolean;
  title?: string;
  productTableHeaders?: any;
  registerNewProductBatch?: any;
  updateProductBatch?: any;
  initiateShipment?: any;
  showActions?: boolean;
  cancelShipment?: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      minHeight: "200px",
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

const RegisteredProductsComponent = ({
  products,
  userList,
  isReadonly,
  title = "Raw Materials Received",
  productTableHeaders = undefined,
  registerNewProductBatch,
  updateProductBatch,
  initiateShipment,
  showActions = true,
  cancelShipment,
}: RegisteredProductProps) => {
  const classes = useStyles();
  const loadOrderDetails = useOrderDetails();
  let tableHeaders = useTableHeaders("regProductBatches");
  if (productTableHeaders) {
    tableHeaders = productTableHeaders;
  }

  const selectedProductRef = useRef<IProduct>();
  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { dialogStatus, updateDialogStatus } = dialogContext;

  const userInfoContext = useContext<IUserInfoContext>(UserInfoContext);
  const { userInfo, userInfoAction } = userInfoContext;

  const [productFormState, dispatchProductFormStateAction] = useReducer(
    reducer,
    { ...PRODUCT_STATE }
  );

  const handleOrderIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(event);
    loadOrderDetails(event.target.value).then((res: any) => {
      const orderData: IOrder = {
        ...res,
      };
      dispatchProductFormStateAction({
        type: "SET_VALUE",
        key: "productName",
        value: orderData.productName,
      });
      dispatchProductFormStateAction({
        type: "SET_VALUE",
        key: "quantity",
        value: orderData.quantity,
      });
      dispatchProductFormStateAction({
        type: "SET_VALUE",
        key: "manufacturerName",
        value: orderData.manufacturerDetail,
      });
      dispatchProductFormStateAction({
        type: "SET_VALUE",
        key: "warehouseLoc",
        value: userInfo.userLocation,
      });
      dispatchProductFormStateAction({
        type: "SET_VALUE",
        key: "retailer",
        value: orderData.retailer,
      });
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchProductFormStateAction({
      type: "SET_VALUE",
      key: event.target.name,
      value: event.target.value,
    });
  };

  const showProductRegDialog: any = () => {
    dispatchProductFormStateAction({
      type: "RESET",
    });
    updateDialogStatus(
      true,
      false,
      "Register Product Batch",
      false,
      "productRegistration"
    );
  };

  const showUpdateDialog: any = (
    productBatchObj: IProduct,
    isProductUpdate: boolean
  ) => {
    dispatchProductFormStateAction({
      type: "SET_PRODUCT_DETAILS",
      data: productBatchObj,
    });
    updateDialogStatus(
      true,
      false,
      isProductUpdate ? "Update Product Batch" : "Cancel Shipment",
      true,
      isProductUpdate ? "productUpdate" : "cancelShipment"
    );
  };

  const closeDialog: MouseEventHandler = () => {
    updateDialogStatus(false, false);
  };

  const handleQRCodeEvent: any = (productInfo: IProductBasicInfo) => {
    updateDialogStatus(
      true,
      false,
      TRACK_UPDATES,
      false,
      productInfo.productId
    );
  };

  const triggerProductShipment = (product: IProduct) => {
    selectedProductRef.current = product;
    updateDialogStatus(false, true, "Confirmation", false, "userConfirmation");
  };

  const confirmUserAction = () => {
    initiateShipment(selectedProductRef.current);
  };

  const populateFormDialogFooter = (isCancel: boolean = false): ReactNode => {
    const getActionButton = (): ReactNode => {
      return isCancel ? (
        <MButtonComponent
          {...PRODUCT_DIALOG_BTN_CONFIG(
            "Submit",
            "contained",
            () => cancelShipment(productFormState),
            "primary"
          )}
        />
      ) : (
        <MButtonComponent
          {...PRODUCT_DIALOG_BTN_CONFIG(
            !dialogStatus.isEditMode ? "Submit" : "Update",
            "contained",
            !dialogStatus.isEditMode
              ? () => registerNewProductBatch(productFormState)
              : () => updateProductBatch(productFormState),
            "primary"
          )}
        />
      );
    };

    return (
      <>
        <MButtonComponent
          variant="outlined"
          label="Close"
          clickHandler={closeDialog}
        />
        {getActionButton()}
      </>
    );
  };

  const populateConfirmDialogFooter = (): ReactNode => {
    return (
      <>
        <MButtonComponent
          {...PRODUCT_DIALOG_BTN_CONFIG("DisAgree", "outlined", closeDialog)}
        />
        <MButtonComponent
          {...PRODUCT_DIALOG_BTN_CONFIG(
            "Agree",
            "contained",
            confirmUserAction,
            "primary"
          )}
        />
      </>
    );
  };

  const populateColumns = (row: IProduct, classes: any) => {
    const _editComp = withActionButton(
      EditIcon,
      "Edit Product Details",
      row.productAdvanceInfo.batchStatus != 0
    );
    const _shipComp = withActionButton(
      LocalShippingIcon,
      "Initiate Product Shipment",
      row.productAdvanceInfo.batchStatus >= 1
    );
    const _closeComp = withActionButton(
      CloseIcon,
      "Cancel Shipment",
      row.productAdvanceInfo.batchStatus != 1
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
              PRODUCT_BATCH_STATUS_AT_DIST[row?.productAdvanceInfo.batchStatus]
            }
            icon={_getInfoIconComp()}
            size="small"
            textColor="#fc0"
          ></MChipComponent>
        </TableCell>

        <TableCell align="left" className={classes.tableBodyCell}>
          {showActions && (
            <>
              {row.productAdvanceInfo.batchStatus != 1 &&
                row.productAdvanceInfo.batchStatus != 2 && (
                  <>
                    {/* Product Edit is not required anymore*/}
                    {/* <_editComp
                      clickHandler={() => showUpdateDialog(row, true)}
                    /> */}
                    <span style={{ paddingLeft: "5px" }}>&nbsp;</span>
                    <_shipComp
                      clickHandler={() => triggerProductShipment(row)}
                    />
                  </>
                )}
              {row.productAdvanceInfo.batchStatus == 1 && (
                <>
                  <_closeComp
                    clickHandler={() => showUpdateDialog(row, false)}
                  />
                </>
              )}
            </>
          )}
        </TableCell>
      </>
    );
  };
  return (
    <>
      {showActions && (
        <MButtonComponent
          variant="contained"
          color="primary"
          label="Register Product Batch"
          classname={classes.addProductBtn}
          clickHandler={showProductRegDialog}
        />
      )}
      <ProductTable
        tableName="Registered Products"
        tableId="regProductTbl"
        dataList={products}
        userList={userList}
        height="350px"
        tableHeaderIdentifier="regProductBatches"
        showShipperCol={true}
        showRetailCol={true}
        getColumns={populateColumns}
        dialogStatus={dialogStatus}
        closeDialog={closeDialog}
        handleQRCodeEvent={handleQRCodeEvent}
      />
      {(dialogStatus.dialogId == "productRegistration" ||
        dialogStatus.dialogId == "productUpdate") && (
        <MFormDialogComponent
          title={dialogStatus.dialogTitle}
          open={dialogStatus.openFormDialog}
          dialogId="rawMaterialFormDialog"
          footerButtons={populateFormDialogFooter(false)}
          fullWidth={true}
          maxWidth="sm"
        >
          <OrderRequestContextProvider>
            <ProductFormComponent
              handleOrderIdChange={handleOrderIdChange}
              handleInputChange={handleInputChange}
              productFormState={productFormState}
              isEditMode={dialogStatus.isEditMode}
              userList={userList}
            />
          </OrderRequestContextProvider>
        </MFormDialogComponent>
      )}
      {dialogStatus.dialogId == "cancelShipment" && (
        <MFormDialogComponent
          title={dialogStatus.dialogTitle}
          open={dialogStatus.openFormDialog}
          dialogId="cancelShipmentFormDialog"
          footerButtons={populateFormDialogFooter(true)}
          fullWidth={true}
          maxWidth="sm"
        >
          <CancellationFormComponent
            handleInputChange={handleInputChange}
            productFormState={productFormState}
          />
        </MFormDialogComponent>
      )}
      {dialogStatus.dialogId == "userConfirmation" && (
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

export default RegisteredProductsComponent;
