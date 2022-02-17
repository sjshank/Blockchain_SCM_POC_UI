import * as helper from "./helper";
import * as actionTypes from "./actionTypes";
import { IRetailerContext } from "../../models/retailer.interface";

export const reducer = (state: IRetailerContext, action: any) => {
  switch (action.type) {
    case actionTypes.SET_DASHBOARD_DATA:
      return helper.storeRetailerDashboardDetails(state, action);
    case actionTypes.SET_PRODUCTS:
      return helper.setProductList(state, action);
    case actionTypes.UPDATE_SALE_COUNT:
      return helper.updateSaleCount(state, action);
    case actionTypes.UPDATE_DAMAGE_COUNT:
      return helper.updateDamageCount(state, action);
    case actionTypes.UPDATE_REJECT_COUNT:
      return helper.updateRejectCount(state, action);
    case actionTypes.UPDATE_APPROVE_COUNT:
      return helper.updateApproveCount(state, action);
    default:
      return state;
  }
};
