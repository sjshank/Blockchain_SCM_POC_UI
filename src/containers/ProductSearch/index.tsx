import React, {
  MouseEventHandler,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { createStyles, makeStyles, Theme, Grid } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IProduct } from "../../models/product.interface";
import ProductCardComponent from "../../components/ProductCard";
import CustomerFormComponent from "../../components/CustomerForm";
import MFormDialogComponent from "../../generic/MFormDialog";
import { DialogContext } from "../../context/DialogContext";
import { IDialogContext } from "../../models/dialog.interface";
import MButtonComponent from "../../generic/MButton";
import { CUSTOMER_STATE, reducer } from "./reducer";
import {
  getTransactionData,
  sendTransaction,
} from "../../services/contractAPI";
import { ISpinnerState } from "../../models/spinner.interface";
import { SpinnerContext } from "../../context/SpinnerContext";
import { ToastContext } from "../../context/ToastContext";
import { allTransactionRef } from "../../config/firebaseConfig";
import { Web3Context } from "../../context/Web3Context";
import { IWeb3State } from "../../models/web3.interface";
import { updateTxDatabase } from "../../services/firebaseAPI";
import { decodeTxDetails } from "../../utils/helpers";

type SearchBoxProps = {
  width?: number | any;
  placeholder: string;
  options: any;
  userListState: any;
  refreshSoldOutCount?: any;
};

const ProductSearchComponent = ({
  width = "100%",
  placeholder = "Search",
  options = [],
  userListState,
  refreshSoldOutCount,
}: SearchBoxProps) => {
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [productData, setProductData] = useState<IProduct>({} as IProduct);
  const [saleStatus, setSaleStatus] = useState<Number>(0);

  const dialogContext = useContext<IDialogContext>(DialogContext);
  const { updateDialogStatus, dialogStatus } = dialogContext;

  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;

  const spinnerContext = useContext<ISpinnerState>(SpinnerContext);
  const { toggleSpinner } = spinnerContext;

  const toastContext = useContext<any>(ToastContext);
  const { toggleToast } = toastContext;

  const [customerFormState, dispatchCustomerFormStateAction] = useReducer(
    reducer,
    { ...CUSTOMER_STATE }
  );

  useEffect(() => {
    const _filteredList: any = options.map((prod: IProduct) => {
      return {
        label: prod.productBasicInfo.productName,
        id: prod.productBasicInfo.productId,
      };
    });
    setProductList(_filteredList);
    return () => {
      setProductList([]);
    };
  }, [options]);

  const searchProductActionHandler = (evt: any, selectedValue: any | null) => {
    if (selectedValue) {
      toggleSpinner();
      const filteredProduct = options.filter((prod: IProduct) => {
        return (
          prod.productBasicInfo.productId.toLowerCase() ==
          selectedValue?.id?.toLowerCase()
        );
      });
      const result: Promise<any> = getTransactionData(
        contractInstance,
        "getProductSaleSatus",
        selectedAccount,
        selectedValue.id
      );
      result
        .then((res) => {
          setSaleStatus(parseInt(res));
          toggleSpinner();
        })
        .catch((e: any) => {
          toggleSpinner();
          toggleToast("error", e?.errorMessage);
        });
      setProductData(
        filteredProduct.length && filteredProduct.length > 0
          ? filteredProduct[0]
          : null
      );
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchCustomerFormStateAction({
      type: "SET_VALUE",
      key: event.target.name,
      value: event.target.value,
      productData: productData,
    });
  };

  const openDialog: any = () => {
    dispatchCustomerFormStateAction({
      type: "RESET",
    });
    updateDialogStatus(
      true,
      false,
      "Customer Information",
      false,
      "customerForm"
    );
  };

  const closeDialog: MouseEventHandler = () => {
    updateDialogStatus(false, false);
  };

  const captureCustomerDetails = () => {
    dispatchCustomerFormStateAction({
      type: "SET_CUSTOMER_INFO",
      data: customerFormState,
      productData: productData,
    });

    try {
      toggleSpinner();
      const result: Promise<any> = sendTransaction(
        contractInstance,
        "updateSaleStatus",
        selectedAccount,
        productData?.productBasicInfo.productId,
        2,
        customerFormState.quantity
      );
      result
        .then((resp) => {
          const UpdatedProductSaleStatusEvt =
            resp?.events["UpdatedProductSaleStatusEvt"]["returnValues"];
          updateTxDatabase(
            resp,
            productData,
            userListState.users,
            "Quantity Sold - ".concat(customerFormState.quantity),
            "Product has been sold out on",
            "retailer"
          );
          const txDetails = decodeTxDetails(resp);
          txDetails
            ?.then((tx: any) => {
              //store customer data against product in firebase
              const productRef = allTransactionRef.child(
                productData ? productData.productBasicInfo.productId : ""
              );
              const customerInfoRef = productRef.child("customerInfo");
              customerInfoRef.push({
                id: tx?.txHash,
                customerName: customerFormState.customerName,
                customerAddress: customerFormState.customerAddress,
                quantity: customerFormState.quantity,
                amountPaid: customerFormState.amountPaid,
                sellerEthAddress: productData?.productAdvanceInfo.retailer,
                timeStamp: tx?.customizedTxTime,
                productInfo: productData,
              });
              setSaleStatus(UpdatedProductSaleStatusEvt["status"]);
              const _updatedProductData = { ...productData };
              _updatedProductData.productBasicInfo.quantity =
                UpdatedProductSaleStatusEvt["updatedQty"];
              _updatedProductData.productBasicInfo.quantityRemain =
                UpdatedProductSaleStatusEvt["updatedQty"];
              setProductData({ ..._updatedProductData });
              refreshSoldOutCount();
            })
            .catch((e: any) => {
              toggleToast("error", e?.errorMessage);
            })
            .finally(() => {
              updateDialogStatus(false, false);
            });
        })
        .catch((e: any) => {
          toggleToast("error", e?.errorMessage);
        })
        .finally(() => {
          toggleSpinner();
          updateDialogStatus(false, false);
        });
    } catch (e: any) {
      toggleSpinner();
      toggleToast("error", e?.errorMessage);
    }
  };

  const populateFormDialogFooter = (): React.ReactNode => {
    return (
      <>
        <MButtonComponent
          variant="outlined"
          label="Cancel"
          clickHandler={closeDialog}
        />
        <MButtonComponent
          variant="contained"
          label="Submit"
          color="primary"
          clickHandler={() => captureCustomerDetails()}
        />
      </>
    );
  };

  return (
    <>
      <Autocomplete
        onChange={(e: any, newValue: any | null) =>
          searchProductActionHandler(e, newValue)
        }
        id="search-product-combo-box"
        options={productList}
        sx={{ width: width }}
        renderInput={(params) => <TextField {...params} label={placeholder} />}
      />
      {productData && (
        <>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            style={{
              margin: 0,
              width: "100%",
              marginTop: 10,
            }}
          >
            <Grid item xs={12} sm={12} lg={6}>
              <ProductCardComponent
                productData={productData}
                buttonAction={openDialog}
                saleStatus={saleStatus}
              />
            </Grid>
          </Grid>
          {dialogStatus.dialogId == "customerForm" && (
            <MFormDialogComponent
              title={dialogStatus.dialogTitle}
              open={dialogStatus.openFormDialog}
              dialogId="customerForm"
              footerButtons={populateFormDialogFooter()}
              fullWidth={true}
              maxWidth="sm"
            >
              <CustomerFormComponent
                customerFormState={customerFormState}
                handleInputChange={handleInputChange}
              />
            </MFormDialogComponent>
          )}
        </>
      )}
    </>
  );
};

export default ProductSearchComponent;
