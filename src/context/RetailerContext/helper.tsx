import { IRetailerContext } from "../../models/retailer.interface";

export const storeRetailerDashboardDetails = (
  state: IRetailerContext,
  action: any
) => {
  return {
    ...state,
    batchesRecievedCount: action["batchesRecieved"],
    batchesRejectedCount: action["batchesRejected"],
    batchesApprovedCount: action["batchesApproved"],
    soldOutCount: action["soldOutCount"],
    products: action["products"],
  };
};

export const setProductList = (state: IRetailerContext, action: any) => {
  return {
    ...state,
    products: action["products"],
  };
};

export const updateSaleCount = (state: IRetailerContext, action: any) => {
  return {
    ...state,
    soldOutCount: action["count"],
  };
};

export const updateApproveCount = (state: IRetailerContext, action: any) => {
  return {
    ...state,
    approvedCount: action["count"],
  };
};

export const updateDamageCount = (state: IRetailerContext, action: any) => {
  return {
    ...state,
    damagedCount: action["count"],
  };
};

export const updateRejectCount = (state: IRetailerContext, action: any) => {
  return {
    ...state,
    rejectedCount: action["count"],
  };
};
