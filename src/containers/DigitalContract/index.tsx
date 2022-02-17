import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import DigitalContractPageLayout from "../../layout/DigitalContractPage";
import { allOrderRef } from "../../config/firebaseConfig";
import UserInfo from "../../components/UserInfo";
import OrderInfo from "../../components/OrderInfo";
import { createStyles, makeStyles, Theme, Fade } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import contractBg from "../../assets/images/contract-bg.png";
import MSpinnerComponent from "../../generic/MSpinner";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderContainer: {
      margin: "5% auto",
      width: "80%",
      padding: "10px 0",
      minHeight: "600px",
      background:
        "linear-gradient(to right, rgba(255,255,255, 0.92) 0 100%), url(" +
        contractBg +
        ")",
      backgroundRepeat: "no-repeat",
      backgroundPositionY: "center",
      border: "1px solid #6f6e6b",
    },
  })
);
const DigitalContract = () => {
  const { id }: any = useParams();
  const [transactionData, setTransactionData] = useState<any>(null as any);
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  useEffect(() => {
    //call to database to contract details
    allOrderRef.child(id).on("value", (snapshot) => {
      setTransactionData(snapshot.val());
      setLoading(false);
    });
  }, [id]);
  return (
    <>
      {loading && <MSpinnerComponent open={loading} />}
      <DigitalContractPageLayout>
        <div>
          {transactionData && transactionData.userDetails && (
            <UserInfo
              role="Retailer"
              userDetails={transactionData.userDetails.retailer}
            />
          )}
        </div>
        <div>
          {transactionData && transactionData.orderDetails && (
            <Paper elevation={0} square className={classes.orderContainer}>
              <OrderInfo
                orderDetails={transactionData.orderDetails}
                txRecords={Object.values(transactionData?.txRecords)}
              />
            </Paper>
          )}
        </div>
        <div>
          {transactionData && transactionData.userDetails && (
            <UserInfo
              role="Distributor"
              userDetails={transactionData.userDetails.distributor}
            />
          )}
        </div>
        {loading && <MSpinnerComponent open={loading} />}
      </DigitalContractPageLayout>
    </>
  );
};

export default DigitalContract;
