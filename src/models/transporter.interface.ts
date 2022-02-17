import { IProduct } from "./product.interface";

export interface ITransporterContext {
  shipmentRequestCount: number | any;
  underTransitCount: number | any;
  packagesDeliveredCount: number | any;
  products: IProduct[];
  setProductList: any;
  storeTransporterDashboardData: any;
}
