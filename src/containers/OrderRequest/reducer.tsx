import { IOrder } from "../../models/order.interface";

export const ORDER_STATE: IOrder = {
  productName: "",
  distributor: "",
  manufacturerDetail: "",
  orderRequestId: "",
  orderStatus: 0,
  productDesc: "",
  reasonForOrderCancellation: "",
  notes: "",
  orderModifiedDate: 0,
  remark: "",
  quantity: 0,
  retailer: "",
};

export const reducer = (state: IOrder, action: any): IOrder => {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "SET_ORDER_INFO":
      const data: IOrder = action["data"];
      const retailer: string = action["retailer"];
      return {
        ...state,
        orderRequestId: data.orderRequestId,
        productName: data.productName,
        productDesc: data.productDesc,
        quantity: data.quantity,
        manufacturerDetail: data.manufacturerDetail,
        distributor: data.distributor,
        notes: data.notes,
        retailer: retailer,
      };
    case "RESET":
      return ORDER_STATE;
    default:
      return state;
  }
};
