import { ITransaction } from "../models/transaction.interface";
import {
  decodeTxDetails,
  getFormattedDate,
  populateUserDetails,
} from "../utils/helpers";
import { allOrderRef, allTransactionRef } from "../config/firebaseConfig";
import { IProduct, IProductAdvanceInfo } from "../models/product.interface";
import { IUserInfo } from "../models/userInfo.interface";
import { IOrder } from "../models/order.interface";

let PRODUCT_DATA: IProduct;
let USER_LIST: IUserInfo[];
let PRODUCT_DB_REF: any;

let ORDER_DATA: IOrder;
let ORDER_DB_REF: any;

export const updateTxDatabase = (
  txData: any,
  productData: IProduct,
  userList: IUserInfo[],
  txMsg: string,
  txCustomMsg: string,
  role: string,
  setOrder: boolean = false
) => {
  const txDetails = decodeTxDetails(txData);
  PRODUCT_DATA = productData;
  USER_LIST = userList;
  txDetails?.then((result: ITransaction | any) => {
    PRODUCT_DB_REF = allTransactionRef.child(
      PRODUCT_DATA.productBasicInfo.productId
    );
    setOrder ? _setOrderInfo() : "";
    //Product Info
    _setProductInfo();
    //User records
    _setUsersInfo();
    //Transaction records
    const txRecordsChildRef = PRODUCT_DB_REF.child("txRecords");
    txRecordsChildRef.push({
      txTime: result.txTime,
      formattedTime: result.customizedTxTime,
      txHash: result.txHash,
      txBlock: result.txBlockNumber,
      txMessage: txMsg,
      txCustomMessage: txCustomMsg.concat(" " + result.customizedTxTime),
      role: role,
    });
  });
};

const _setProductInfo = () => {
  const productDetailsChildRef = PRODUCT_DB_REF.child("productInfo");
  productDetailsChildRef.set(PRODUCT_DATA);
};

const _setOrderInfo = () => {
  const productDetailsChildRef = PRODUCT_DB_REF.child("orderInfo");
  const _orderInfo = {
    orderRequestId: PRODUCT_DATA.productBasicInfo.orderRequestId,
    submissionDate: getFormattedDate(
      PRODUCT_DATA.productBasicInfo.orderSubmissionDate
    ),
    orderStatus: PRODUCT_DATA.productAdvanceInfo.orderStatus,
    orderStatusMsg: _getOrderStatusMsg(
      PRODUCT_DATA.productAdvanceInfo.orderStatus
    ),
    modifiedDate: getFormattedDate(
      PRODUCT_DATA.productAdvanceInfo.orderModifiedDate
    ),
  };
  productDetailsChildRef.set(_orderInfo);
};

const _setUsersInfo = () => {
  const usersChildRef = PRODUCT_DB_REF.child("userInfo");
  const productAdvanceInfo: IProductAdvanceInfo =
    PRODUCT_DATA.productAdvanceInfo;
  usersChildRef.set({
    distributor: populateUserDetails(
      "2",
      productAdvanceInfo.distributor,
      USER_LIST
    ),
    retailer: populateUserDetails("3", productAdvanceInfo.retailer, USER_LIST),
    transporter: populateUserDetails(
      "4",
      productAdvanceInfo.transporter,
      USER_LIST
    ),
  });
};

const _getOrderStatusMsg = (_status: number | any) => {
  if (_status == 3) {
    return "Order is processing";
  } else if (_status == 4) {
    return "Order completed";
  } else {
    return "";
  }
};

export const storeOrderAgreementDetails = (
  txData: any,
  orderData: IOrder,
  userList: IUserInfo[],
  txMsg: string,
  txCustomMsg: string,
  role: string
) => {
  const txDetails = decodeTxDetails(txData);
  ORDER_DATA = orderData;
  USER_LIST = userList;
  txDetails?.then((result: ITransaction | any) => {
    ORDER_DB_REF = allOrderRef.child(ORDER_DATA.orderRequestId);

    /* Order details*/
    const orderDetailsChildRef = ORDER_DB_REF.child("orderDetails");
    orderDetailsChildRef.set(ORDER_DATA);

    /* User details*/
    const usersChildRef = ORDER_DB_REF.child("userDetails");
    const orderInfo: IOrder = ORDER_DATA;
    usersChildRef.set({
      distributor: populateUserDetails("2", orderInfo.distributor, USER_LIST),
      retailer: populateUserDetails("3", orderInfo.retailer, USER_LIST),
    });

    //Transaction records
    const txRecordsChildRef = ORDER_DB_REF.child("txRecords");
    txRecordsChildRef.push({
      txTime: result.txTime,
      formattedTime: result.customizedTxTime,
      txHash: result.txHash,
      txBlock: result.txBlockNumber,
      txMessage: txMsg,
      txCustomMessage: txCustomMsg.concat(" " + result.customizedTxTime),
      role: role,
    });
  });
};
