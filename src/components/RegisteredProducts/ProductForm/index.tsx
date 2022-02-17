import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IUserInfo } from "../../../models/userInfo.interface";
import MTextFieldComponent from "../../../generic/MTextField";
import MSimpleSelectComponent from "../../../generic/MBasicSelect";
import { IProduct } from "../../../models/product.interface";
import { getUserListForDropdown } from "../../../utils/helpers";

import _ from "lodash";
import { IWeb3State } from "../../../models/web3.interface";
import { Web3Context } from "../../../context/Web3Context";
import { IOrder } from "../../../models/order.interface";
import { IOrderRequestContext } from "../../../models/orderRequest.interface";
import { OrderRequestContext } from "../../../context/OrderRequestContext";
import {
  getTransactionData,
  sendTransaction,
} from "../../../services/contractAPI";
import useOrderDetails from "../../../hooks/useOrderDetails";
import { ToastContext } from "../../../context/ToastContext";

type ProductFormProps = {
  productFormState: IProduct;
  handleInputChange?: any;
  handleOrderIdChange?: any;
  isEditMode?: boolean;
  userList: Array<IUserInfo>;
  formStyles?: any;
  isFormDisabled?: boolean;
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

const ProductFormComponent = ({
  productFormState,
  handleInputChange,
  handleOrderIdChange,
  isEditMode = false,
  userList,
  formStyles = null,
  isFormDisabled = false,
}: ProductFormProps) => {
  let formClasses = useFormStyles();
  if (formStyles) {
    formClasses = formStyles;
  }
  const result = getUserListForDropdown(userList);

  const loadOrderDetails = useOrderDetails();

  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;

  const toastContext = useContext<any>(ToastContext);
  const { toggleToast } = toastContext;

  const orderRequestContext =
    useContext<IOrderRequestContext>(OrderRequestContext);
  const { orders, setOrderList } = orderRequestContext;

  useEffect(() => {
    try {
      if (contractInstance) {
        const orderResult = getTransactionData(
          contractInstance,
          "getDistributorAssignedOrders",
          selectedAccount,
          selectedAccount
        );
        orderResult
          .then((orderIds: any) => {
            let _listOfOrder: IOrder[] = [];
            orderIds.forEach((ordId: any) => {
              loadOrderDetails(ordId).then((res: any) => {
                const orderData: IOrder = {
                  ...res,
                };
                if (orderData.orderStatus == 2) _listOfOrder.push(orderData);
                setOrderList(
                  _.orderBy(
                    _listOfOrder,
                    (item: IOrder) => item.orderModifiedDate,
                    "desc"
                  )
                );
              });
            });
          })
          .catch((e: any) => {
            toggleToast("error", e?.errorMessage);
          });
      }
    } catch (e: any) {
      toggleToast("error", e?.errorMessage);
    }
  }, []);
  let orderDetails = new Array();
  Object.keys(orders).map((key) => {
    if (orders[key].manufacturerDetail) {
      orderDetails.push({
        key: orders[key].orderRequestId,
        value: orders[key].orderRequestId,
      });
    }
  });
  return (
    <div>
      <div className={formClasses.textFieldBar}>
        <MSimpleSelectComponent
          required={true}
          id="orderRequestId"
          name="orderRequestId"
          label="Order Request ID"
          variant="outlined"
          selectedValue={productFormState.productBasicInfo.orderRequestId}
          disabled={isFormDisabled}
          options={orderDetails}
          helpText="Choose Order Id to associate with product batch"
          classname={formClasses.select}
          changeHandler={handleOrderIdChange}
        />
      </div>

      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="productName"
          name="productName"
          label="Product Name"
          variant="outlined"
          value={productFormState.productBasicInfo.productName}
          disabled={true}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
          // helpText="Product name should be match with requested product"
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="productDesc"
          name="productDesc"
          label="Product Description"
          variant="outlined"
          value={productFormState.productBasicInfo.productDesc}
          disabled={isFormDisabled}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="warehouseLoc"
          name="warehouseLoc"
          label="Warehouse Address"
          variant="outlined"
          helpText="Distribution center address"
          value={productFormState.productBasicInfo.warehouseLoc}
          disabled={true}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="quantity"
          name="quantity"
          type="number"
          label="Quantity"
          variant="outlined"
          value={productFormState.productBasicInfo.quantity}
          disabled={true}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
          helpText="Total quantity should be match with requested quantity"
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="price"
          name="price"
          type="number"
          label="Price per Product"
          variant="outlined"
          value={productFormState.productBasicInfo.price}
          disabled={isFormDisabled}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="totalPrice"
          name="totalPrice"
          type="number"
          label="Total Price"
          variant="outlined"
          value={
            productFormState.productBasicInfo.quantity *
            productFormState.productBasicInfo.price
          }
          disabled={true}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="manufacturerName"
          name="manufacturerName"
          type="text"
          label="Manufacturer Name"
          variant="outlined"
          value={productFormState.productAdvanceInfo.manufacturerName}
          disabled={true}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
          // helpText="Manufacturer name should be match with requested manufacturer detail"
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="manufacturerLoc"
          name="manufacturerLoc"
          type="text"
          label="Manufacturer Address"
          variant="outlined"
          value={productFormState.productAdvanceInfo.manufacturerLoc}
          disabled={isFormDisabled}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MSimpleSelectComponent
          required={true}
          id="transporter"
          name="transporter"
          label="Logistic Service Provider"
          variant="outlined"
          selectedValue={productFormState.productAdvanceInfo.transporter}
          disabled={isFormDisabled}
          options={result.transporters ? result.transporters : []}
          helpText="Transporter wallet address"
          classname={formClasses.select}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MSimpleSelectComponent
          required={true}
          id="retailer"
          name="retailer"
          label="AAP Store"
          variant="outlined"
          selectedValue={productFormState.productAdvanceInfo.retailer}
          disabled={true}
          options={result.retailers ? result.retailers : []}
          helpText="AAP store wallet address"
          classname={formClasses.select}
          changeHandler={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ProductFormComponent;
