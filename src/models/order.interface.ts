export interface IOrder {
  orderRequestId: string;
  productName: string;
  productDesc: string;
  quantity: number | any;
  distributor: string | any;
  retailer: string | any;
  manufacturerDetail: string | any;
  orderStatus: number | any;
  reasonForOrderCancellation: string | any;
  orderModifiedDate?: number | any;
  notes?: string | any;
  remark?: string | any;
  submissionTimestamp: number;
}
