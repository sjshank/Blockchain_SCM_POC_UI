import { IProduct } from "./product.interface";

export interface IDistributorContext {
  batchesShippedCount: number | any;
  batchesRejectedCount: number | any;
  batchesApprovedCount: number | any;
  products: IProduct[];
  storeDistributorDashboardData: any;
  setProductList: any;
}
