import React, { useEffect, useReducer, useState } from "react";
import Web3Config from "../../config/web3Config";
import { IWeb3State } from "../../models/web3.interface";
import UserContract from "../../contracts/User.json";
import TransporterContract from "../../contracts/Transporter.json";
import OrderContract from "../../contracts/Order.json";
import DistributorContract from "../../contracts/Distributor.json";
import RetailerContract from "../../contracts/Retailer.json";
import { reducer } from "./reducer";
import _ from "lodash";
import { getDeepMergedContractCopy } from "./helper";

declare const window: Window &
  typeof globalThis & {
    WEB3: any;
    WEB3SOCKET: any;
  };

const Web3_Initial_State: IWeb3State = {
  contractInstance: undefined,
  accounts: [],
  selectedAccount: "",
  selectedAccountBal: 0,
  networkId: "",
  chainId: "",
  isMetaMask: false,
  contractStorageAddress: "",
  web3: null,
  web3Socket: null,
  contractAddress: undefined,
  web3SocketSupplyChainInst: undefined,
};

const Web3Context = React.createContext<IWeb3State>(Web3_Initial_State);

const Web3ContextProvider = (props: any) => {
  const [web3State, setWeb3State] = useState<IWeb3State>(
    () => Web3_Initial_State
  );
  const [web3ContextState, dispatchWeb3ContextAction] = useReducer(
    reducer,
    Web3_Initial_State
  );

  useEffect(() => {
    (async () => {
      // retrieve web3 object with active connection running on port
      const config: any = await Web3Config();
      const { web3, web3Socket } = await config.web3Instance;
      if (window) {
        window.WEB3 = web3;
        window.WEB3SOCKET = web3Socket;
      }
      //populate all the available accounts from local running blockchain
      const _accounts = await web3.eth.getAccounts();
      //get the network id of running blockchain
      const _networkId = await web3.eth.net.getId();

      /***************** SUPPLYCHAIN CONTRACT ****************/

      //get deployed network based on network id for required contract
      // const supplyChainDeployedNetwork =
      //   SupplyChainContract.networks[_networkId];
      // const supplychainInstance = new web3Socket.eth.Contract(
      //   SupplyChainContract.abi,
      //   supplyChainDeployedNetwork && supplyChainDeployedNetwork.address,
      //   {
      //     handleRevert: true,
      //   }
      // );
      //generate contract instance based on contract address, abi, and web2 from deployed network
      // const supplychainInstance = new web3.eth.Contract(
      //   SupplyChainContract.abi,
      //   supplyChainDeployedNetwork && supplyChainDeployedNetwork.address,
      //   {
      //     handleRevert: true,
      //   }
      // );

      /***************** USER CONTRACT ****************/

      //get deployed network based on network id for required contract
      const userDeployedNetwork = UserContract.networks[_networkId];
      //generate contract instance based on contract address, abi, and web2 from deployed network
      const userInstance = new web3.eth.Contract(
        UserContract.abi,
        userDeployedNetwork && userDeployedNetwork.address,
        {
          handleRevert: true,
        }
      );

      /***************** TRANSPORTER CONTRACT ****************/

      //get deployed network based on network id for required contract
      const transporterDeployedNetwork =
        TransporterContract.networks[_networkId];
      //generate contract instance based on contract address, abi, and web2 from deployed network
      const transporterInstance = new web3.eth.Contract(
        TransporterContract.abi,
        transporterDeployedNetwork && transporterDeployedNetwork.address,
        {
          handleRevert: true,
        }
      );

      /***************** ORDER CONTRACT ****************/

      //get deployed network based on network id for required contract
      const orderDeployedNetwork = OrderContract.networks[_networkId];
      //generate contract instance based on contract address, abi, and web2 from deployed network
      const orderInstance = new web3.eth.Contract(
        OrderContract.abi,
        orderDeployedNetwork && orderDeployedNetwork.address,
        {
          handleRevert: true,
        }
      );

      /***************** DISTRIBUTOR CONTRACT ****************/

      //get deployed network based on network id for required contract
      const distributorDeployedNetwork =
        DistributorContract.networks[_networkId];
      //generate contract instance based on contract address, abi, and web2 from deployed network
      const distributorInstance = new web3.eth.Contract(
        DistributorContract.abi,
        distributorDeployedNetwork && distributorDeployedNetwork.address,
        {
          handleRevert: true,
        }
      );

      /*************** RETAILER CONTRACT ****************/

      //get deployed network based on network id for required contract
      const retailerDeployedNetwork = RetailerContract.networks[_networkId];
      //generate contract instance based on contract address, abi, and web2 from deployed network
      const retailerInstance = new web3.eth.Contract(
        RetailerContract.abi,
        retailerDeployedNetwork && retailerDeployedNetwork.address,
        {
          handleRevert: true,
        }
      );

      // const _contractStorageAddress = await web3.eth.getStorageAt(
      //   supplychainInstance._address
      // );

      const _accBalance = await web3.eth.getBalance(
        web3.currentProvider.selectedAddress
      );
      const mergedContract = await getDeepMergedContractCopy(
        userInstance,
        transporterInstance,
        orderInstance,
        distributorInstance,
        retailerInstance
      );

      console.log("mergedContract", mergedContract);

      //Populate state object

      await setWeb3State({
        contractInstance: _.cloneDeep(mergedContract),
        accounts: _accounts,
        selectedAccount: web3.currentProvider.selectedAddress,
        selectedAccountBal: web3.utils.fromWei(_accBalance),
        networkId: _networkId,
        chainId: web3.eth.getChainId(),
        isMetaMask: web3.currentProvider.isMetaMask,
        web3: web3,
        web3Socket: web3Socket,
        contractStorageAddress: "",
        web3SocketSupplyChainInst: undefined,
      });
    })();
  }, [web3State.selectedAccount]);

  return (
    <Web3Context.Provider value={web3State}>
      {props.children}
    </Web3Context.Provider>
  );
};

export { Web3Context, Web3ContextProvider };
