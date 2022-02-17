import { IOrderRequestContext } from "../../models/orderRequest.interface";

export const setOrderList = (state: IOrderRequestContext, action: any) => {
  return {
    ...state,
    orders: action["orders"],
  };
};
