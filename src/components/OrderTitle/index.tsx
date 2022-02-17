import React from "react";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import MTypography from "../../generic/MTypography";
import { IOrder } from "../../models/order.interface";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    medNameSection: {
      display: "flex",
      width: "100%",
    },
    nameDiv: {
      width: "50%",
      "& span": {
        verticalAlign: "sub",
      },
    },
    moreDetails: {
      width: "25%",
    },
    showMoreIcon: {
      paddingLeft: 5,
      margin: 0,
      cursor: "pointer",
      "&:hover": {
        transform: "scale(1.2)",
        transition: "all 0.3s",
      },
    },
    qrCodeDiv: {
      width: "45%",
    },
    ulBox: {
      listStyle: "none",
      paddingLeft: 0,
      marginLeft: 0,
      fontWeight: 500,
      marginTop: 0,
      marginBottom: 0,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      letterSpacing: "0.00938em",
      lineHeight: 1.1,
    },
    anchorLink: {
      // color: "#185ADB",
      color: "#cc3300",
      textDecoration: "underline",
      cursor: "text",
      display: "flex",
      "& .openIcon": {
        color: "#cc3300",
        marginTop: 4,
      },
    },
    subText: {
      fontSize: 11,
      color: "rgba(0, 0, 0, 0.54)",
      lineHeight: 1.5,
    },
  })
);

const OrderTitleComponent = (props: any) => {
  const classes = useStyles();
  const orderData: IOrder = props.orderData;
  return (
    <div>
      <div className={classes.ulBox}>
        <div>
          <MTypography
            variant="h6"
            component="h6"
            text={orderData.productName}
            classname={classes.anchorLink}
            style={{ fontSize: 16, }}
          />
          <span className={classes.subText}>{orderData.orderRequestId}</span>
          <br/>
          <span className={classes.subText}>{orderData.productDesc}</span>
        </div>
        <div>
          <span
            style={{
              fontSize: 13,
              color: "#373737",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {orderData.manufacturerDetail}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderTitleComponent);
