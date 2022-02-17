import { IAdminContext } from "../../models/admin.interface";

export const storeAdminDashboardDetails = (
  state: IAdminContext,
  action: any
) => {
  return {
    ...state,
    usersCount: action["usersCount"],
    registeredUsers: action["users"],
  };
};

export const setProducts = (state: IAdminContext, action: any) => {
  return {
    ...state,
    registeredProducts: action["products"],
  };
};
