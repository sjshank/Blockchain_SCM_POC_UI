import React, { useReducer } from "react";
import { IProduct } from "../../models/product.interface";
import { ITransporterContext } from "../../models/transporter.interface";
import * as actionTypes from "./actionTypes";
import { reducer } from "./reducer";

const Transporter_Initial_State: ITransporterContext = {
  products: [] as IProduct[],
  setProductList: undefined,
  storeTransporterDashboardData: undefined,
  shipmentRequestCount: 0,
  underTransitCount: 0,
  packagesDeliveredCount: 0,
};

const TransporterContext = React.createContext<ITransporterContext>(
  Transporter_Initial_State
);

const TransporterContextProvider = (props: any) => {
  const [TransporterContextState, dispatchTransporterContextAction] =
    useReducer(reducer, Transporter_Initial_State);

  const storeDashboardDataHandler = (
    _products: any[],
    _shipmentRequestCount: any,
    _underTransitCount: any,
    _packagesDeliveredCount: any
  ) => {
    dispatchTransporterContextAction({
      type: actionTypes.SET_TRANSPORTER_DASHBOARD_DATA,
      products: _products,
      shipmentRequestCount: _shipmentRequestCount,
      underTransitCount: _underTransitCount,
      packagesDeliveredCount: _packagesDeliveredCount,
    });
  };

  const setProductListHandler = (_products: IProduct[] = []) => {
    dispatchTransporterContextAction({
      type: actionTypes.SET_PRODUCTS,
      products: _products,
    });
  };

  return (
    <TransporterContext.Provider
      value={{
        products: TransporterContextState.products,
        setProductList: setProductListHandler,
        storeTransporterDashboardData: storeDashboardDataHandler,
        shipmentRequestCount: TransporterContextState.shipmentRequestCount,
        underTransitCount: TransporterContextState.underTransitCount,
        packagesDeliveredCount: TransporterContextState.packagesDeliveredCount,
      }}
    >
      {props.children}
    </TransporterContext.Provider>
  );
};

export { TransporterContext, TransporterContextProvider };
