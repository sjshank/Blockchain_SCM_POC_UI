import firebase from 'firebase/app'
import "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyD75egZPJA1l5aa3BCJBdNYyD-WLcQBh8M",
  authDomain: "supplychain-blockchain-poc.firebaseapp.com",
  databaseURL: "https://supplychain-blockchain-poc-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const databaseRef = firebase.database().ref();
export const allTransactionRef = databaseRef.child("allTransactions");
export const allOrderRef = databaseRef.child("orders");

export default firebase;