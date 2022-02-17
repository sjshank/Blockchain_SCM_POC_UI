import { getTransactionData } from "../services/contractAPI";
import { Web3Context } from "../context/Web3Context";
import { IWeb3State } from "../models/web3.interface";
import { useContext } from "react";

const useOrderDetails = () => {
  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;
  const loadOrderDetails = (orderRequestId: string | any) => {
    return getTransactionData(
      contractInstance,
      "getOrderDetails",
      selectedAccount,
      orderRequestId
    );
  };

  return loadOrderDetails;
};

export default useOrderDetails;
