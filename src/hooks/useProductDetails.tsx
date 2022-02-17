import { getTransactionData } from "../services/contractAPI";
import { Web3Context } from "../context/Web3Context";
import { IWeb3State } from "../models/web3.interface";
import { useContext } from "react";

const useProductDetails = () => {
  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;
  const loadProductDetails = (productId: string | any) => {
    return getTransactionData(
      contractInstance,
      "getProductDetails",
      selectedAccount,
      productId
    );
  };

  return loadProductDetails;
};

export default useProductDetails;
