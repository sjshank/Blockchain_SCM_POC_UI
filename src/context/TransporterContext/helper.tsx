import { ITransporterContext } from "../../models/transporter.interface";

export const storeTransporterDashboardDetails = (
  state: ITransporterContext,
  action: any
) => {
  return {
    ...state,
    shipmentRequestCount: action["shipmentRequestCount"],
    underTransitCount: action["underTransitCount"],
    packagesDeliveredCount: action["packagesDeliveredCount"],
    products: action["products"],
  };
};
export const setProductList = (state: ITransporterContext, action: any) => {
  return {
    ...state,
    products: action["products"],
  };
};
