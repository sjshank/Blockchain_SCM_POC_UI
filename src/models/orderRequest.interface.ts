import { IOrder } from "./order.interface";

export interface IOrderRequestContext {
  orders: IOrder[];
  setOrderList: any;
}
