import React, { useReducer } from "react";
import { IOrder } from "../../models/order.interface";
import { IOrderRequestContext } from "../../models/orderRequest.interface";
import * as actionTypes from "./actionTypes";
import { reducer } from "./reducer";

const Order_Request_Initial_State: IOrderRequestContext = {
  orders: [] as IOrder[],
  setOrderList: undefined,
};

const OrderRequestContext = React.createContext<IOrderRequestContext>(
  Order_Request_Initial_State
);

const OrderRequestContextProvider = (props: any) => {
  const [OrderRequestContextState, dispatchOrderRequestContextAction] =
    useReducer(reducer, Order_Request_Initial_State);

  const setOrderListHandler = (_orders: IOrder[]) => {
    dispatchOrderRequestContextAction({
      type: actionTypes.SET_ORDERS,
      orders: _orders,
    });
  };

  return (
    <OrderRequestContext.Provider
      value={{
        orders: OrderRequestContextState.orders,
        setOrderList: setOrderListHandler,
      }}
    >
      {props.children}
    </OrderRequestContext.Provider>
  );
};

export { OrderRequestContext, OrderRequestContextProvider };
