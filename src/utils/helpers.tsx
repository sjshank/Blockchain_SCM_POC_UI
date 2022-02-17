import { IError } from "../models/error.interface";
import { IUserInfo } from "../models/userInfo.interface";
import { CUSTOM_ERROR_MESSAGES, USER_ROLE_LIST } from "./constants";
import _ from "lodash";
import { IProduct } from "../models/product.interface";
import { ITransaction } from "../models/transaction.interface";

declare const window: Window &
  typeof globalThis & {
    WEB3: any;
  };

export const populateUserListWithRoleName = (data: any) => {
  let activeUsersCount = 0;
  const _users = data.map((user: any) => {
    if (!user.isDeleted) {
      activeUsersCount = activeUsersCount + 1;
    }
    return {
      ...user,
      userRole: parseInt(user.userRole),
      userRoleName: USER_ROLE_LIST[parseInt(user.userRole)],
    };
  });
  return { _users, activeUsersCount };
};

export const populateCustomErrorObject = (errorObject: IError) => {
  const { code, message, stack } = { ...errorObject };
  const customError = CUSTOM_ERROR_MESSAGES.find((err: any) => {
    if (message?.toLowerCase()?.indexOf(err.keyword.toLowerCase()) > -1) {
      return err;
    } else if (code == "INVALID_ARGUMENT") {
      return CUSTOM_ERROR_MESSAGES[0];
    }
  });
  customError ? customError : CUSTOM_ERROR_MESSAGES[0];
  return {
    errorCode: `Error-${customError?.code}`,
    errorMessage: customError?.errMsg,
  };
};

export const populateRoleBasedList = (users: IUserInfo[]) => {
  return {
    supplierList: users.filter((usr: IUserInfo) => {
      // if (
      //   !usr.isDeleted &&
      //   usr.userStatus === "Active" &&
      //   usr.userRole === "1"
      // ) {
      //   return usr;
      // }
    }),
    transporterList: users.filter((usr: IUserInfo) => {
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "4"
      ) {
        return usr;
      }
    }),
    manufacturerList: users.filter((usr: IUserInfo) => {
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "1"
      ) {
        return usr;
      }
    }),
    distributorList: users.filter((usr: IUserInfo) => {
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "2"
      ) {
        return usr;
      }
    }),
    retailerList: users.filter((usr: IUserInfo) => {
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "3"
      ) {
        return usr;
      }
    }),
    //Inspector not in scope
    inspectorList: users.filter((usr: IUserInfo) => {
      // if (
      //   !usr.isDeleted &&
      //   usr.userStatus === "Active" &&
      //   usr.userRole === "9"
      // ) {
      //   return usr;
      // }
    }),
  };
};

export const populateUserName = (
  _role: string,
  _address: string,
  userList: IUserInfo[]
): string | any => {
  const userDetails = userList.find((usr: IUserInfo) => {
    if (
      !usr.isDeleted &&
      usr.userStatus === "Active" &&
      usr.userRole === _role &&
      usr.userAddress?.toLowerCase() === _address?.toLowerCase()
    ) {
      return usr;
    }
  });
  return userDetails?.userName;
};

export const populateTxBlockDetails = (record: any = {} as any) => {
  try {
    if (window && window?.WEB3) {
      const _web3Object = window?.WEB3;
      const allTransactionInfo: any = [];
      let outputObject: any = {};
      const _txBlocks = record.transactionBlocks
        ? record.transactionBlocks
        : [];
      if (Array.isArray(_txBlocks)) {
        return new Promise((resolve, reject) => {
          _txBlocks.forEach((bNumber) => {
            _web3Object.eth
              .getBlock(bNumber)
              .then((result: any) => {
                if (result) {
                  allTransactionInfo.push({
                    txTime: result.timestamp,
                    customizedTxTime: getFormattedDate(result.timestamp),
                    hash: result.hash,
                    number: result.number,
                  });
                }
                if (allTransactionInfo.length === _txBlocks.length) {
                  Object.assign(outputObject, record);
                  outputObject["txData"] = _.sortBy(allTransactionInfo, [
                    "number",
                  ]);
                  resolve(outputObject);
                }
              })
              .catch((err: any) => {
                console.error(err);
                reject({
                  errorCode: CUSTOM_ERROR_MESSAGES[0].code,
                  errorMessage: CUSTOM_ERROR_MESSAGES[0].errMsg,
                });
              });
          });
        });
      }
    }
  } catch (e) {
    throw {
      errorCode: CUSTOM_ERROR_MESSAGES[0].code,
      errorMessage: CUSTOM_ERROR_MESSAGES[0].errMsg,
    };
  }
};

export const getMedicineURL = (id: string): string => {
  return `${location.origin}/medicine/${id}`;
};

export const getProductURL = (id: string): string => {
  return `${location.origin}/${id}`;
};

export const getContractURL = (id: string): string => {
  return `${location.origin}/${id}`;
};

export const isPublicFacing = (): boolean => {
  return (
    location.pathname.indexOf("0") > -1 ||
    location.pathname.indexOf("0") > -1
  );
};

export const populateUserDetails = (
  _role: any,
  _address: any,
  userList: IUserInfo[]
) => {
  const userDetails: IUserInfo | any = userList.find((usr: IUserInfo) => {
    if (
      !usr.isDeleted &&
      usr.userStatus === "Active" &&
      usr.userRole === _role &&
      usr.userAddress?.toLowerCase() === _address?.toLowerCase()
    ) {
      return usr;
    }
  });
  return {
    userName: userDetails.userName,
    userAddress: userDetails.userAddress,
    userLocation: userDetails.userLocation,
    userRole: userDetails.userRole,
    userStatus: userDetails.userStatus,
    registrationDate: userDetails.registrationDate,
    isDeleted: userDetails.isDeleted,
  };
};

export const populateUserDetailsinMaterialRecord = (
  materialRecord: any,
  userList: IUserInfo[]
) => {
  const updatedRecord = { ...materialRecord };
  //Supplier role is not in scope
  updatedRecord.supplierDetails = populateUserDetails(
    "111111",
    updatedRecord.supplier,
    userList
  );
  updatedRecord.manufacturerDetails = populateUserDetails(
    "1",
    updatedRecord.manufacturer,
    userList
  );
  updatedRecord.transporterDetails = populateUserDetails(
    "4",
    updatedRecord.shipper,
    userList
  );

  return updatedRecord;
};

export const populateUserDetailsinMedicineRecord = (
  medicineRecord: any,
  userList: IUserInfo[]
) => {
  const updatedRecord = { ...medicineRecord };
  updatedRecord.manufacturerDetails = populateUserDetails(
    "1",
    updatedRecord.manufacturer,
    userList
  );
  updatedRecord.transporterDetails = populateUserDetails(
    "4",
    updatedRecord.shipper,
    userList
  );
  updatedRecord.distributorDetails = populateUserDetails(
    "2",
    updatedRecord.distributor,
    userList
  );

  return updatedRecord;
};

export const isMedicineApproved = (medicine: any): boolean => {
  return ["1"].indexOf(medicine?.saleStatus) > -1;
};

export const isMedicineExpired = (medicine: any): boolean => {
  return ["0", "2", "3"].indexOf(medicine?.saleStatus) > -1;
};

export const getFormattedDate = (timestamp: any) => {
  return new Date(timestamp * 1000)
    .toLocaleDateString()
    .concat(", " + new Date(timestamp * 1000).toLocaleTimeString());
};

export const getUserListForDropdown = (
  userList: IUserInfo[] | undefined
): any => {
  const retailers: Array<{ key: any; value: any }> = [];
  const transporters: Array<{ key: any; value: any }> = [];
  const suppliers: Array<{ key: any; value: any }> = [];
  const manufacturers: Array<{ key: any; value: any }> = [];
  const distributors: Array<{ key: any; value: any }> = [];
  const inspectors: Array<{ key: any; value: any }> = [];

  if (Array.isArray(userList)) {
    userList.map((usr: IUserInfo) => {
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "3"
      ) {
        return retailers.push({ key: usr.userName, value: usr.userAddress });
      }
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "4"
      ) {
        return transporters.push({ key: usr.userName, value: usr.userAddress });
      }
      //Supplier role is not in scope
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "11111"
      ) {
        return suppliers.push({ key: usr.userName, value: usr.userAddress });
      }
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "1"
      ) {
        return manufacturers.push({
          key: usr.userName,
          value: usr.userAddress,
        });
      }
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "2"
      ) {
        return distributors.push({ key: usr.userName, value: usr.userAddress });
      }
      //Inspector is not on scope
      if (
        !usr.isDeleted &&
        usr.userStatus === "Active" &&
        usr.userRole === "999999"
      ) {
        return inspectors.push({ key: usr.userName, value: usr.userAddress });
      }
    });
  }

  return {
    retailers,
    transporters,
    suppliers,
    manufacturers,
    distributors,
    inspectors,
  };
};

export const populateShipmentSummary = (
  _shipmentRequestCount: number,
  _underTransitCount: number,
  _packagesDeliveredCount: number,
  product: IProduct
) => {
  debugger;
  if (product.productAdvanceInfo.batchStatus == 1) {
    _shipmentRequestCount++;
  } else if (product.productAdvanceInfo.batchStatus == 3) {
    _underTransitCount++;
  } else if (product.productAdvanceInfo.batchStatus >= 4) {
    _packagesDeliveredCount++;
  }

  return [_shipmentRequestCount, _underTransitCount, _packagesDeliveredCount];
};

export const populateStoreSummary = (
  _batchesRecievedCount: number,
  _batchesRejectedCount: number,
  _batchesApprovedCount: number,
  product: IProduct
) => {
  if (product.productAdvanceInfo.batchStatus == 4) {
    _batchesRecievedCount++;
  } else if (product.productAdvanceInfo.batchStatus == 5) {
    _batchesRejectedCount++;
  } else if (product.productAdvanceInfo.batchStatus == 6) {
    _batchesApprovedCount++;
  }

  return [_batchesRecievedCount, _batchesRejectedCount, _batchesApprovedCount];
};

export const decodeTxDetails = (record: any = {} as any) => {
  try {
    if (window && window?.WEB3) {
      const _web3Object = window?.WEB3;
      let decodedTx: ITransaction;
      return new Promise((resolve, reject) => {
        _web3Object.eth
          .getBlock(record.blockNumber)
          .then((result: any) => {
            if (result) {
              decodedTx = {
                txTime: result.timestamp,
                customizedTxTime: getFormattedDate(result.timestamp),
                txHash: record.transactionHash,
                txBlockNumber: result.number,
              };
              resolve(decodedTx);
            }
          })
          .catch((err: any) => {
            console.error(err);
            reject({
              errorCode: CUSTOM_ERROR_MESSAGES[0].code,
              errorMessage: CUSTOM_ERROR_MESSAGES[0].errMsg,
            });
          });
      });
    }
  } catch (e) {
    throw {
      errorCode: CUSTOM_ERROR_MESSAGES[0].code,
      errorMessage: CUSTOM_ERROR_MESSAGES[0].errMsg,
    };
  }
};

export const getRoleBasedTxRecords = (txRecords: any, roleName: string) => {
  return Object.values(txRecords)?.filter(
    (record: any) => record["role"] === roleName
  );
};

export const getFilteredCustomerRecords = (customers: any) => {
  return Object.values(customers)?.map((record: any) => {
    return record;
  });
};
