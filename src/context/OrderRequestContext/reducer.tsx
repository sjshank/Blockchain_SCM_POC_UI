import * as helper from "./helper";
import * as actionTypes from "./actionTypes";
import { IOrderRequestContext } from "../../models/orderRequest.interface";

export const reducer = (state: IOrderRequestContext, action: any) => {
  switch (action.type) {
    case actionTypes.SET_ORDERS:
      return helper.setOrderList(state, action);
    default:
      return state;
  }
};
