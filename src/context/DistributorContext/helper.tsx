import { IDistributorContext } from "../../models/distributor.interface";

export const storeDistributorDashboardDetails = (
  state: IDistributorContext,
  action: any
) => {
  
  return {
    ...state,
    batchesShippedCount: action["batchesCount"],
    batchesRejectedCount: action["batchesRejected"],
    batchesApprovedCount: action["batchesApproved"],
    products: action["products"],
  };
};

export const setProductList = (state: IDistributorContext, action: any) => {
  return {
    ...state,
    products: action["products"],
  };
};
