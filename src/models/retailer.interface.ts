import { IProduct } from "./product.interface";

export interface IRetailerContext {
  batchesRecievedCount: number | any;
  batchesRejectedCount: number | any;
  batchesApprovedCount: number | any;
  soldOutCount: number | any;
  damagedCount: number | any;
  approvedCount: number | any;
  rejectedCount: number | any;
  products: IProduct[];
  storeRetailerDashboardData: any;
  setProductList: any;
  updateSoldOutCount: any;
  updateDamageCount: any;
  updateApprovedCount: any;
  updateRejectedCount: any;
}
