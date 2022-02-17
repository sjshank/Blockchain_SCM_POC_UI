import React, { ReactNode } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  Paper,
  CardContent,
} from "@material-ui/core";
import { Card, CardMedia } from "@material-ui/core";
import Product_Parts from "../../assets/images/product_parts.png";
import { IProduct, IProductAdvanceInfo } from "../../models/product.interface";
import MTypography from "../../generic/MTypography";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DangerousIcon from "@mui/icons-material/Dangerous";
import VerifiedIcon from "@mui/icons-material/Verified";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { ORDER_PROGRESS } from "../../utils/constants";
import clsx from "clsx";

type ProductInfoCardProps = {
  productInfo: IProduct;
  transactionData: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      // width: 330,
      width: "450px",
    },
    cardContent: {
      display: "flex",
      clear: "both",
    },
    cardHeaderRoot: {
      padding: 0,
      display: "flex",
      alignItems: "center",
    },
    cardHeaderContent: {
      flex: "1 1 auto",
      display: "block",
    },
    cardHeaderTitle: {
      fontSize: "1.2rem",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "0em",
      margin: 0,
      color: "#373737",
    },
    cardHeaderSubTitle: {
      color: "rgba(0, 0, 0, 0.54)",
      textTransform: "capitalize",
      fontSize: 10,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: "0.00938em",
      margin: 0,
      display: "block",
    },
    manufacturerTxt: {
      fontSize: "12px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      lineHeight: 1.66,
      letterSpacing: "0.03333em",
      color: "#373737",
    },
    statusIcon: {
      width: "1.5em !important",
      height: "1.5em !important",
    },
    statusTxt: {
      fontSize: 14,
      marginTop: 0,
      fontWeight: 600,
      marginBottom: 0,
    },
    eachStep: {
      fontSize: 12,
      "& .MuiStepLabel-label": {
        fontSize: 10,
        marginTop: "5px !important",
      },
      marginBottom: 10,
    },
  })
);

const ProductInfoCardComponent = ({
  productInfo,
  transactionData,
}: ProductInfoCardProps) => {
  const classes = useStyles();
  const displayStatus = (
    productAdvanceInfo: IProductAdvanceInfo
  ): ReactNode => {
    let status: ReactNode;
    const batchStatus = productAdvanceInfo.batchStatus;
    if (batchStatus < 1) {
      status = (
        <>
          <AppRegistrationIcon
            fontSize="medium"
            className={classes.statusIcon}
            style={{ color: "#113CFC" }}
          />
          <p className={classes.statusTxt} style={{ color: "#113CFC" }}>
            Registered
          </p>
        </>
      );
    } else if (batchStatus >= 1 && batchStatus <= 3) {
      status = (
        <>
          <LocalShippingIcon
            fontSize="medium"
            style={{ color: "#fc0" }}
            className={classes.statusIcon}
          />
          <p className={classes.statusTxt} style={{ color: "#fc0" }}>
            Under Transit
          </p>
        </>
      );
    } else if (batchStatus == 4) {
      status = (
        <>
          <DeliveryDiningIcon
            fontSize="medium"
            style={{ color: "rgb(0, 100, 0)" }}
            className={classes.statusIcon}
          />
          <p className={classes.statusTxt} style={{ color: "rgb(0, 100, 0)" }}>
            Delivered at Store
          </p>
        </>
      );
    } else if (batchStatus == 5) {
      status = (
        <>
          <DangerousIcon
            fontSize="medium"
            style={{ color: "#B61919" }}
            className={classes.statusIcon}
          />
          <p className={classes.statusTxt} style={{ color: "#B61919" }}>
            Rejected
          </p>
        </>
      );
    } else if (batchStatus == 6) {
      status = (
        <>
          <VerifiedIcon
            fontSize="medium"
            style={{ color: "#006400" }}
            className={classes.statusIcon}
          />
          <p className={classes.statusTxt} style={{ color: "#006400" }}>
            Verified
          </p>
        </>
      );
    }
    return (
      <div style={{ textAlign: "right", justifyContent: "right" }}>
        {status}
      </div>
    );
  };

  const populateOrderStatusStepper = (): ReactNode => {
    return (
      <Stepper
        activeStep={transactionData.orderInfo.orderStatus}
        alternativeLabel
        style={{ zoom: "90%", marginTop: 10 }}
      >
        {ORDER_PROGRESS.map((label, index: number) => {
          return (
            [1].indexOf(index) < 0 && (
              <Step key={label} className={classes.eachStep}>
                <StepLabel>{label}</StepLabel>
              </Step>
            )
          );
        })}
      </Stepper>
    );
  };

  return (
    <Paper elevation={5} square>
      <Card className={clsx(classes.card, "mobile-card")}>
        <CardMedia
          component="img"
          height="110"
          image={Product_Parts}
          alt="Product Image"
          style={{ objectFit: "contain" }}
        />
        <CardContent style={{ padding: 10 }}>
          <div className={classes.cardContent}>
            <div style={{ float: "left", width: "65%" }}>
              <div className={classes.cardHeaderRoot}>
                <div className={classes.cardHeaderContent}>
                  <span className={classes.cardHeaderTitle}>
                    {productInfo.productBasicInfo.productName}
                  </span>
                  <span className={classes.cardHeaderSubTitle}>
                    {productInfo.productBasicInfo.productDesc}
                  </span>
                </div>
              </div>
              <MTypography
                variant="caption"
                classname={classes.manufacturerTxt}
                component="span"
                text={`${productInfo.productAdvanceInfo.manufacturerName}`}
              />
              <br/>
              <MTypography
                variant="caption"
                classname={classes.cardHeaderSubTitle}
                component="span"
                text={`${productInfo.productAdvanceInfo.manufacturerLoc}`}
              />
            </div>
            <div style={{ float: "right", width: "35%" }}>
              {displayStatus(productInfo.productAdvanceInfo)}
            </div>
          </div>
        </CardContent>
        <hr
          style={{
            borderWidth: 0,
            borderTop: "1px solid #c6c6c6",
            marginBottom: 20,
            marginTop: 0,
          }}
        />
        {populateOrderStatusStepper()}
      </Card>
    </Paper>
  );
};

export default ProductInfoCardComponent;
