import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { IProduct } from "../../models/product.interface";
import "./index.css";
import CarParts from "../../assets/images/car-parts.jpg";
import NumberFormat from "react-number-format";
import MButtonComponent from "../../generic/MButton";
import { getProductURL } from "../../utils/helpers";
import VerifiedIcon from "@mui/icons-material/Verified";
import MTooltipComponent from "../../generic/MTooltip";

type ProductCardProps = {
  productData: IProduct | null;
  buttonAction: any;
  saleStatus: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    verified: {
      float: "right",
      width: "max-content",
      clear: "both",
      paddingRight: 8,
      paddingTop: 3,
    },
    quantityBar: {
      display: "flex",
      flexGrow: 1,
      color: "#a6a6a6",
      justifyContent: "center",
      margin: 5,
    },
    genericFont: {
      fontWeight: 600,
      fontSize: 12,
    },
    hr: {
      width: "70%",
      borderWidth: 0,
      borderTop: "1px solid #a6a6a65c",
    },
    seperator: {
      paddingLeft: 5,
      paddingRight: 5,
      color: "rgba(166, 166, 166, 0.36)",
    },
  })
);

const ProductCardComponent = ({
  productData = null,
  buttonAction,
  saleStatus = null,
}: ProductCardProps) => {
  const classes = useStyles();
  const handleViewUpdatesEvent = () => {
    window.open(
      getProductURL(productData ? productData.productBasicInfo.productId : ""),
      "_blank"
    );
  };

  const populateSpanContent = (data, taggedClass = "") => {
    return <span className={taggedClass}>{data}</span>;
  };
  return (
    <>
      {productData &&
        productData.productBasicInfo &&
        productData.productAdvanceInfo && (
          <section className="product">
            <div className="product__photo">
              <div className="photo-container">
                <div className="photo-main">
                  <img src={CarParts} alt="car parts"></img>
                </div>
              </div>
            </div>
            <div className="product__info">
              <div className={classes.verified}>
                <MTooltipComponent title="Verified" placement="top">
                  <VerifiedIcon
                    fontSize="medium"
                    style={{ color: "#2FDD92" }}
                  />
                </MTooltipComponent>
              </div>
              <div className="title">
                <h1>{productData.productBasicInfo.productName}</h1>
                {populateSpanContent(productData.productBasicInfo.productId)}
                <br />
                {populateSpanContent(productData.productBasicInfo.productDesc)}
                <br />
                {populateSpanContent(
                  productData.productAdvanceInfo.manufacturerName,
                  classes.genericFont
                )}
                &nbsp;
                {populateSpanContent(
                  productData.productAdvanceInfo.manufacturerLoc
                )}
              </div>
              <div className={classes.quantityBar}>
                <div>
                  <span className={classes.genericFont}>Quantity: </span>
                  <span>{productData.productBasicInfo.quantity}</span>
                </div>
                <div className={classes.seperator}>&nbsp;|&nbsp;</div>
                <div>
                  <span className={classes.genericFont}>Price per Qty: </span>
                  <span>
                    ${""}
                    <NumberFormat
                      value={productData.productBasicInfo.price}
                      displayType={"text"}
                      thousandSeparator={true}
                      decimalSeparator="."
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </span>
                </div>
              </div>
              <hr className={classes.hr} />
              <div className="price">
                USD${" "}
                <NumberFormat
                  value={
                    productData.productBasicInfo.price *
                    productData.productBasicInfo.quantity
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </div>
              {saleStatus > -1 && (
                <MButtonComponent
                  classname="buy--btn"
                  label={saleStatus == 2 ? "SOLD OUT" : "ADD TO SOLD OUT"}
                  clickHandler={buttonAction}
                  disabled={saleStatus > 0}
                />
              )}
              <br />
              <a onClick={handleViewUpdatesEvent} className="viewUpdateBtn">
                View Updates
              </a>
            </div>
          </section>
        )}
    </>
  );
};

export default ProductCardComponent;
