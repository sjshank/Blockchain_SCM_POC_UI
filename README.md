# Blockchain POC in Supply Chain Domain : UI Artifcat #

This repository responsible for all the UI/ReactJS code artifact.


## Blockchain benefits in Supply Chain Domain ##

https://aws.amazon.com/blockchain/blockchain-for-supply-chain-track-and-trace/



### How do I get set up? ###

* Clone Blockchain code from "git clone https://saurabhshankariya@bitbucket.org/saurabhshankariya/aap_supplychainpoc_blockchain.git"
* Dependencies : Make sure your system has truffle, ganache-cli, node & npm installed.
* To install above dependencies
    * Download & install Node JS from https://nodejs.org/en/download/
    * Verify node & npm : "node --version" & "npm --version"
    * Install truffle & ganache-cli : "npm install truffle -g" & "npm install ganache-cli -g"

* Run local blockchain using command "ganache-cli --allowUnlimitedContractSize  --gasLimit 0xFFFFFFFFFFFF --gasPrice 0x2 --accounts 20 --defaultBalanceEther 200000000" in separate CMD
* Run "truffle migrate" command against pulled out blockchain code to compile, build & deploy smart contracts.
* Clone React UI code from "git clone https://saurabhshankariya@bitbucket.org/saurabhshankariya/aap_supplychainpoc_blockchain.git"
* Copy all the compiled or deployed contracts from aap_supplychainpoc_blockchain\build\contracts & Paste inside aap_supplychainpoc_blockchain_ui\src\contracts
* Run "npm install", "npm start" & navigate to "https://localhost:4000"
* Dependencies : Chrome browser, Metamask plugin for chrome



### Test your local application in Chrome ###

* https://localhost:4000
* Use below username & address to get logged in role specific dashboard
    * username : USER_ADMIN         address : hex value of account[1]           role : Admin
    * username : USER_MANU          address : hex value of account[2]           role : Product Manufacturer
    * username : USER_DIST          address : hex value of account[3]           role : Product Distributor
    * username : USER_RETAIL        address : hex value of account[4]           role : Product Shopkeeper/Retailer
    * username : USER_SHPR          address : hex value of account[5]           role : Transporter/Shipper




### Contribution guidelines ###

* Always work on develop branch
* Create your custom new branch from develop branch & make your respective changes  
* Commit your changes in your custom branch & raise Pull Request against develop
* Please add relevant comments while commiting your changes
* Assign to Saurabh Shankariya for code review



### Having any queries, Reach out to ? ###

* For business understanding : Nitin Srivastava <nitin.srivastava@advance-auto.com>
* For any technical, project setup  : 
    * Saurabh Shankariya <saurabh.shankariya@advance.com>
    * Chandrakanth Komatireddy <c.komatireddy@advance-auto.com>



### Resources ###

* Ethereum Blockchain : https://ethereum.org/en/
* Solidity Language - Writing Smart Contracts : https://docs.soliditylang.org/en/v0.8.7/
* Truffle Suite - DAPPS development environment : https://www.trufflesuite.com/
* Ganache - Local Blockchain : https://www.trufflesuite.com/ganache
* React.JS - UI : https://reactjs.org/
