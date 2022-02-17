export interface IProduct {
  productBasicInfo: IProductBasicInfo;
  productAdvanceInfo: IProductAdvanceInfo;
}

export interface IProductBasicInfo {
  productId: string;
  orderRequestId: string;
  productName: string;
  productDesc: string;
  warehouseLoc: any;
  quantity: number | any;
  quantityRemain: number | any;
  totalPrice: number | any;
  price: number | any;
  orderSubmissionDate: number;
}

export interface IProductAdvanceInfo {
  batchStatus: number | any;
  transporter: string | any;
  distributor: string | any;
  retailer: string | any;
  manufacturerName?: string | any;
  manufacturerLoc?: string | any;
  reasonForShipmentCancellation?: string | any;
  reasonForPackageRejection?: string | any;
  lastModifiedTimestamp?: number | any;
  orderStatus: number | any;
  orderModifiedDate: number;
}
