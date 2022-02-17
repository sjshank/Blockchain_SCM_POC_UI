import React from "react";
import { ORDER_PROGRESS } from "../../utils/constants";
import approved from "../../assets/images/approved-stamp.png";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { getFormattedDate } from "../../utils/helpers";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    innerContainer: {
      textAlign: "center",
    },
    titleContainer: {
      minWidth: "350px",
      margin: "38px auto",
      width: "88%",
      textAlign: "left",
      "& span": {
        wordBreak: "break-all",
        display: "inline-block",
        textTransform: "capitalize",
        width: "65%",
        verticalAlign: "top",
      },
    },
    label: {
      width: "30% !important",
      fontWeight: 500,
      margin: "0 10px 10px 0",
    },
    approvedImg: {
      width: "150px",
      height: "90px",
      float: "right",
      marginTop: "20px",
    },
    corner: {
      width: "0",
      height: "0",
      transform: "scale(-1)",
      top: "45px",
      position: "absolute",
      borderTop: "50px solid #6f6e6b",
      borderBottom: "50px solid transparent",
      borderRight: "50px solid transparent",
    },
    transparentCorner: {
      width: "0",
      height: "0",
      top: "96px",
      left: "29.6%",
      position: "absolute",
      borderTop: "60px solid #fafafa",
      borderBottom: "60px solid transparent",
      borderRight: "60px solid transparent",
    },
  })
);
const OrderInfo = (props) => {
  const { orderDetails, txRecords } = props;
  const classes = useStyles();
  console.log(txRecords);

  const txURL = (tx: string) => {
    return `https://rinkeby.etherscan.io/tx/${tx}`;
  };

  return (
    <div className={classes.innerContainer}>
      <div className={classes.transparentCorner}></div>
      <div className={classes.corner}></div>
      <h2 style={{ textTransform: "uppercase" }}>Digital Agreement</h2>
      <div className={classes.titleContainer}>
        <div>
          <span className={classes.label}>order Request Id </span>
          <span>{orderDetails.orderRequestId}</span>
        </div>
        <div>
          <span className={classes.label}>Product Name </span>
          <span>{orderDetails.productName}</span>
        </div>
        <div>
          <span className={classes.label}>Manufacturer </span>
          <span>{orderDetails.manufacturerDetail}</span>
        </div>
        <div>
          <span className={classes.label}>Product Quantity </span>
          <span>{orderDetails.quantity}</span>
        </div>
        <div>
          <span className={classes.label}>Order Submitted On</span>
          <span>{getFormattedDate(orderDetails.submissionTimestamp)}</span>
        </div>
        <div>
          <span className={classes.label}>order Status </span>
          <span>{ORDER_PROGRESS[orderDetails.orderStatus]}</span>
        </div>
        <div>
          <span className={classes.label}>Transaction </span>
          <span>
            <a href={txURL(txRecords[1]?.txHash)} target="_blank">
              {txRecords[1]?.txHash}
            </a>
          </span>
        </div>
        {orderDetails.reasonForOrderCancellation && (
          <div>
            <span className={classes.label}>Reason for Cancel </span>
            <span>{orderDetails.reasonForOrderCancellation}</span>
          </div>
        )}
        {!orderDetails.reasonForOrderCancellation && (
          <div>
            <img src={approved} className={classes.approvedImg} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderInfo;
