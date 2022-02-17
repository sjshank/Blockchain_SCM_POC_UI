import React from "react";
import MTooltipComponent from "../../generic/MTooltip";
import { getProductURL } from "../../utils/helpers";
import ProductQRCodeComponent from "../ProductQRCode";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { IProduct } from "../../models/product.interface";
import MTypography from "../../generic/MTypography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
      cursor: "pointer",
      display: "flex",
      "& .openIcon": {
        color: "#cc3300",
        marginTop: 4,
      },
    },
    subText: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.54)",
      lineHeight: 1.5,
    },
  })
);

const ProductTitleComponent = (props: any) => {
  const classes = useStyles();
  const productData: IProduct = props.productData;
  const handleViewUpdatesEvent = () => {
    window.open(
      getProductURL(productData.productBasicInfo.productId),
      "_blank"
    );
  };
  return (
    <div>
      {/* <Grid container>
        <Grid item zeroMinWidth style={{ maxWidth: "fit-content" }}> */}
      <div className={classes.ulBox}>
        <div>
          <MTooltipComponent title="Click to view updates" placement="top">
            <a onClick={handleViewUpdatesEvent} className={classes.anchorLink}>
              <MTypography
                variant="h6"
                component="h6"
                text={productData.productBasicInfo.productName}
                style={{ fontSize: 16 }}
              />
              <OpenInNewIcon className="openIcon" fontSize="small" />
            </a>
          </MTooltipComponent>
          <span className={classes.subText}>
            {productData.productBasicInfo.productDesc}
          </span>
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
            {productData.productAdvanceInfo.manufacturerName}
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <span className={classes.subText}>
            {productData.productAdvanceInfo.manufacturerLoc}
          </span>
          <LocationOnIcon
            fontSize="small"
            style={{ color: "#373737", marginTop: -5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductTitleComponent);
