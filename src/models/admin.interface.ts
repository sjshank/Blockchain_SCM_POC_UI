import { IProduct } from "./product.interface";
import { IUserInfo } from "./userInfo.interface";

export interface IAdminContext {
  usersCount: number;
  registeredUsers: Array<IUserInfo>;
  registeredProducts: IProduct[];
  storeAdminData: any;
  setProducts: any;
}
