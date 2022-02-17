import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { IWeb3State } from "../models/web3.interface";
import { getTransactionData } from "../services/contractAPI";

const useCount = () => {
  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;
  const getCounter = (methodName) => {
    const _count = getTransactionData(
      contractInstance,
      methodName,
      selectedAccount,
      selectedAccount
    );
    return _count;
  };
  return getCounter;
};

export default useCount;
