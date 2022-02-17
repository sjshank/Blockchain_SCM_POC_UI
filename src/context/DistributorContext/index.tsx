import React, { useReducer } from "react";
import { IDistributorContext } from "../../models/distributor.interface";
import { IProduct } from "../../models/product.interface";
import * as actionTypes from "./actionTypes";
import { reducer } from "./reducer";

const Distributor_Initial_State: IDistributorContext = {
  batchesShippedCount: 0,
  batchesRejectedCount: 0,
  batchesApprovedCount: 0,
  products: [] as IProduct[],
  storeDistributorDashboardData: undefined,
  setProductList: undefined,
};

const DistributorContext = React.createContext<IDistributorContext>(
  Distributor_Initial_State
);

const DistributorContextProvider = (props: any) => {
  const [DistributorContextState, dispatchDistributorContextAction] =
    useReducer(reducer, Distributor_Initial_State);

  const storeDistributorDashboardDataHandler = (
    _batchesCount: any,
    _batchesRejected: any,
    _batchesApproved: any,
    _products: any[]
  ) => {
    dispatchDistributorContextAction({
      type: actionTypes.SET_DISTRIBUTOR_DASHBOARD_DATA,
      batchesCount: _batchesCount,
      batchesRejected: _batchesRejected,
      batchesApproved: _batchesApproved,
      products: _products,
    });
  };

  const setProductListHandler = (_products: any[]) => {
    dispatchDistributorContextAction({
      type: actionTypes.SET_PRODUCTS,
      products: _products,
    });
  };

  return (
    <DistributorContext.Provider
      value={{
        batchesShippedCount: DistributorContextState.batchesShippedCount,
        batchesRejectedCount: DistributorContextState.batchesRejectedCount,
        batchesApprovedCount: DistributorContextState.batchesApprovedCount,
        products: DistributorContextState.products,
        storeDistributorDashboardData: storeDistributorDashboardDataHandler,
        setProductList: setProductListHandler,
      }}
    >
      {props.children}
    </DistributorContext.Provider>
  );
};

export { DistributorContext, DistributorContextProvider };
