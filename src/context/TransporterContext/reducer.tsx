import * as helper from "./helper";
import * as actionTypes from "./actionTypes";
import { ITransporterContext } from "../../models/transporter.interface";

export const reducer = (state: ITransporterContext, action: any) => {
  switch (action.type) {
    case actionTypes.SET_TRANSPORTER_DASHBOARD_DATA:
      return helper.storeTransporterDashboardDetails(state, action);
    case actionTypes.SET_PRODUCTS:
      return helper.setProductList(state, action);
    default:
      return state;
  }
};
