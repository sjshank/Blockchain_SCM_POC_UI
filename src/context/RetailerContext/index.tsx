import React, { useReducer } from "react";
import { IProduct } from "../../models/product.interface";
import { IRetailerContext } from "../../models/retailer.interface";
import * as actionTypes from "./actionTypes";
import { reducer } from "./reducer";

const Retailer_Initial_State: IRetailerContext = {
  products: [] as IProduct[],
  storeRetailerDashboardData: undefined,
  setProductList: undefined,
  updateSoldOutCount: undefined,
  updateDamageCount: undefined,
  updateApprovedCount: undefined,
  updateRejectedCount: undefined,
  batchesRecievedCount: 0,
  batchesApprovedCount: 0,
  batchesRejectedCount: 0,
  soldOutCount: 0,
  approvedCount: 0,
  damagedCount: 0,
  rejectedCount: 0,
};

const RetailerContext = React.createContext<IRetailerContext>(
  Retailer_Initial_State
);

const RetailerContextProvider = (props: any) => {
  const [RetailerContextState, dispatchRetailerContextAction] = useReducer(
    reducer,
    Retailer_Initial_State
  );

  const storeDashboardDataHandler = (
    _products: any[],
    _batchesRecieved: any = 0,
    _batchesApproved: any = 0,
    _batchesRejected: any = 0,
    _soldOutCount: any = 0
  ) => {
    dispatchRetailerContextAction({
      type: actionTypes.SET_DASHBOARD_DATA,
      products: _products,
      batchesRecieved: _batchesRecieved,
      batchesApproved: _batchesApproved,
      batchesRejected: _batchesRejected,
      soldOutCount: _soldOutCount,
    });
  };

  const setProductListHandler = (_products: any[]) => {
    dispatchRetailerContextAction({
      type: actionTypes.SET_PRODUCTS,
      products: _products,
    });
  };

  const updateSoldOutCountHandler = (_count: any) => {
    dispatchRetailerContextAction({
      type: actionTypes.UPDATE_SALE_COUNT,
      count: _count,
    });
  };

  const updateDamagedCountHandler = (_count: any) => {
    dispatchRetailerContextAction({
      type: actionTypes.UPDATE_DAMAGE_COUNT,
      count: _count,
    });
  };

  const updateApprovedCountHandler = (_count: any) => {
    dispatchRetailerContextAction({
      type: actionTypes.UPDATE_APPROVE_COUNT,
      count: _count,
    });
  };

  const updateRejectedCountHandler = (_count: any) => {
    dispatchRetailerContextAction({
      type: actionTypes.UPDATE_REJECT_COUNT,
      count: _count,
    });
  };

  return (
    <RetailerContext.Provider
      value={{
        products: RetailerContextState.products,
        storeRetailerDashboardData: storeDashboardDataHandler,
        setProductList: setProductListHandler,
        updateSoldOutCount: updateSoldOutCountHandler,
        updateApprovedCount: updateApprovedCountHandler,
        updateRejectedCount: updateRejectedCountHandler,
        updateDamageCount: updateDamagedCountHandler,
        batchesRecievedCount: RetailerContextState.batchesRecievedCount,
        batchesApprovedCount: RetailerContextState.batchesApprovedCount,
        batchesRejectedCount: RetailerContextState.batchesRejectedCount,
        soldOutCount: RetailerContextState.soldOutCount,
        approvedCount: RetailerContextState.approvedCount,
        damagedCount: RetailerContextState.damagedCount,
        rejectedCount: RetailerContextState.rejectedCount,
      }}
    >
      {props.children}
    </RetailerContext.Provider>
  );
};

export { RetailerContext, RetailerContextProvider };
