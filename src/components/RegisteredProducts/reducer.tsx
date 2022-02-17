import {
  IProduct,
  IProductAdvanceInfo,
  IProductBasicInfo,
} from "../../models/product.interface";

const PRODUCT_BASIC_STATE: IProductBasicInfo = {
  productName: "",
  productDesc: "",
  productId: "",
  quantity: 0,
  price: 0,
  totalPrice: 0,
  warehouseLoc: "",
  orderRequestId: "",
  orderSubmissionDate: 0,
  quantityRemain: 0,
};

const PRODUCT_ADVANCE_STATE: IProductAdvanceInfo = {
  batchStatus: 0,
  distributor: "",
  retailer: "",
  transporter: "",
  manufacturerLoc: "",
  manufacturerName: "",
  orderStatus:0,
  orderModifiedDate:0
};

export const PRODUCT_STATE: IProduct = {
  productBasicInfo: PRODUCT_BASIC_STATE,
  productAdvanceInfo: PRODUCT_ADVANCE_STATE,
};

export const reducer = (state: IProduct, action: any): IProduct => {
  switch (action.type) {
    case "SET_VALUE":
      const _formState = { ...state };
      const _productBasic = { ..._formState.productBasicInfo };
      const _productAdvance = { ..._formState.productAdvanceInfo };
      if (_productBasic[action.key] !== undefined) {
        _productBasic[action.key] = action.value;
      } else {
        _productAdvance[action.key] = action.value;
      }
      return {
        ..._formState,
        productBasicInfo: _productBasic,
        productAdvanceInfo: _productAdvance,
      };
    case "SET_PRODUCT_DETAILS":
      const data: IProduct = action["data"];
      return {
        ...state,
        productBasicInfo: data["productBasicInfo"],
        productAdvanceInfo: data["productAdvanceInfo"],
      };
    case "RESET":
      return PRODUCT_STATE;
    default:
      return state;
  }
};
