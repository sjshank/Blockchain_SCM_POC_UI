import React, { useReducer } from "react";
import { IAdminContext } from "../../models/admin.interface";
import { IProduct } from "../../models/product.interface";
import { IUserInfo } from "../../models/userInfo.interface";
import * as actionTypes from "./actionTypes";
import { reducer } from "./reducer";

const Admin_Initial_State: IAdminContext = {
  usersCount: 0,
  registeredUsers: [] as IUserInfo[],
  registeredProducts: [] as IProduct[],
  storeAdminData: undefined,
  setProducts: undefined,
};

const AdminContext = React.createContext<IAdminContext>(Admin_Initial_State);

const AdminContextProvider = (props: any) => {
  const [AdminContextState, dispatchAdminContextAction] = useReducer(
    reducer,
    Admin_Initial_State
  );

  const storeAdminDashboardDataHandler = (
    _usersCount: number,
    _users: IUserInfo[]
  ) => {
    dispatchAdminContextAction({
      type: actionTypes.SET_ADMIN_DASHBOARD_DATA,
      usersCount: _usersCount,
      users: _users,
    });
  };

  const setProductsHandler = (_products: any) => {
    dispatchAdminContextAction({
      type: actionTypes.SET_PRODUCTS,
      products: _products,
    });
  };

  return (
    <AdminContext.Provider
      value={{
        usersCount: AdminContextState.usersCount,
        registeredUsers: AdminContextState.registeredUsers,
        registeredProducts: AdminContextState.registeredProducts,
        storeAdminData: storeAdminDashboardDataHandler,
        setProducts: setProductsHandler,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export { AdminContext, AdminContextProvider };
