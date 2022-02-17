export interface IWeb3State {
  contractInstance: any;
  userContractInstance?: string | any;
  supplierContractInstance?: string | any;
  manufacturerContractInstance?: string | any;
  distributorContractInstance?: string | any;
  pharmaContractInstance?: string | any;
  accounts?: Array<string> | Array<any>;
  selectedAccount?: string | null;
  selectedAccountBal?: any;
  networkId?: string | any;
  chainId?: string;
  isMetaMask?: boolean;
  contractStorageAddress?: string | any;
  web3?: any;
  web3Socket?: any;
  contractAddress?: string | any;
  web3SocketSupplyChainInst?: any;
}
