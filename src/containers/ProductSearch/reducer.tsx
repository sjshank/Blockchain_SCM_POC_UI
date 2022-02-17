import { ICustomer } from "../../models/customer.interface";
import { IProduct } from "../../models/product.interface";

export const CUSTOMER_STATE: ICustomer = {
  customerAddress: "",
  customerName: "",
  amountPaid: 0,
  productId: "",
  quantity: 0,
  retailer: "",
};

export const reducer = (state: ICustomer, action: any): ICustomer => {
  switch (action.type) {
    case "SET_VALUE": {
      const productData: IProduct = action["productData"];
      if (action.key == "quantity") {
        return {
          ...state,
          [action.key]: action.value,
          amountPaid:
            parseInt(action.value) *
            parseInt(productData.productBasicInfo.price),
        };
      } else {
        return {
          ...state,
          [action.key]: action.value,
        };
      }
    }
    case "SET_CUSTOMER_INFO": {
      const data: ICustomer = action["data"];
      const productData: IProduct = action["productData"];
      return {
        ...state,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        quantity: data.quantity,
        amountPaid: data.amountPaid,
        productId: data.productId,
        retailer: productData.productAdvanceInfo.retailer,
      };
    }
    case "RESET":
      return CUSTOMER_STATE;
    default:
      return state;
  }
};
