import React, { useEffect, useState } from "react";
import {
  Container,
  createStyles,
  Fade,
  makeStyles,
  Slide,
  Theme,
} from "@material-ui/core";
import { useParams } from "react-router";
import { allTransactionRef } from "../../config/firebaseConfig";
import AppFooterComponent from "../../components/AppFooter";
import { APP_FOOTER_TEXT } from "../../utils/constants";
import MSpinnerComponent from "../../generic/MSpinner";
import NotAvailableComponent from "../../generic/NotAvailable";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "../../assets/images/logo.svg";
import ProductInfoCardComponent from "../../components/ProductInfoCard";
import DistributorInfo from "../../components/DistributorInfo";
import TransporterInfo from "../../components/TransporterInfo";
import RetailerInfo from "../../components/RetailerInfo";
import CustomerCardComponent from "../../components/CustomerCard";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      backgroundColor: "#373737",
      fontFamily: "Helvetica, sans-serif",
      minHeight: `calc(100vh)`,
      paddingBottom: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      backgroundColor: "#373737",
      fontFamily: "Helvetica, sans-serif",
    },
    pageTitle: {
      fontFamily: "'Special Elite', cursive !important",
      color: "#fc0",
      textAlign: "center",
      fontSize: 35,
      marginBottom: 20,
      textDecoration: "underline",
    },
    productInfo: {
      // padding: 10,
      color: "#373737",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      paddingBottom: 0,
    },
    timeline: {
      position: "relative",
      maxWidth: 1200,
      margin: "auto",
      "&:after": {
        content: '""',
        position: "absolute",
        width: "6px",
        backgroundColor: "#fff",
        top: 0,
        bottom: 0,
        left: "50%",
        marginLeft: "-3px",
      },
    },
    timelineContainer: {
      padding: "10px 40px",
      position: "relative",
      backgroundColor: "inherit",
      width: "50%",
      "&:after": {
        content: '""',
        position: "absolute",
        width: 20,
        height: 20,
        right: -14,
        backgroundColor: "rgb(47, 221, 146)",
        border: "4px solid #fff",
        top: 40,
        borderRadius: "50%",
        zIndex: 1,
      },
      "& .content": {
        marginLeft: "auto",
      },
    },
    left: {
      left: 0,
      "&:before": {
        content: '" "',
        height: 0,
        position: "absolute",
        top: 44,
        width: 0,
        zIndex: 1,
        right: 31,
        border: "medium solid #fff",
        borderWidth: "10px 0 10px 10px",
        borderColor: "transparent transparent transparent #fff",
      },
    },
    right: {
      left: "50%",
      "&:before": {
        content: '" "',
        height: 0,
        position: "absolute",
        top: 44,
        width: 0,
        zIndex: 1,
        left: 31,
        transform: "rotate(180deg)",
        border: "medium solid #fff",
        borderWidth: "10px 0 10px 10px",
        borderColor: "transparent transparent transparent #fff",
      },
      "&:after": {
        left: -14,
      },
    },
    content: {
      padding: "10px 15px",
      backgroundColor: "#fff",
      width: 425,
      position: "relative",
      borderRadius: 6,
      // zoom: "90%",
      color: "#373737",
    },
    barTitle: {
      fontSize: 18,
      fontWeight: 600,
      textAlign: "center",
      padding: 10,
      textTransform: "uppercase",
      color: "#cc3300",
    },
    ulBox: {
      listStyle: "none",
      paddingLeft: 0,
      marginLeft: 0,
      color: theme.palette.primary.main,
      fontSize: 12,
      fontWeight: 600,
    },
    list: {
      paddingTop: 0,
      paddingBottom: 0,
      "& .MuiListItem-button": {
        padding: "4px !important",
      },
    },
    eachItemText: {
      "& span": { fontSize: "11px !important", lineHeight: "1 !important" },
    },
    updateBox: {
      marginTop: 15,
      marginBottom: 5,
      textAlign: "center",
    },
    eachChipItem: {
      margin: 4,
      fontSize: 12,
      height: 25,
      backgroundColor: "#4caf50",
      color: "#fff",
      width: "100%",
    },
    notAvailableRoot: {
      textAlign: "center",
      fontSize: 20,
      padding: 20,
      paddingTop: "8%",
      color: "#fff",
    },
    printIcon: {
      color: "#fff",
      margin: 10,
      marginRight: 20,
      cursor: "pointer",
    },
    toolBar: {
      justifyContent: "left",
      textAlign: "left",
      alignItems: "left",
      paddingRight: 0,
      paddingLeft: 0,
      // marginTop: 10,
      // marginBottom: 10,
    },
    title: {
      // marginTop: 10,
      fontWeight: 600,
    },
    logo: {
      maxWidth: 125,
      verticalAlign: "middle",
      marginBottom: 20,
    },
    marginLeftAuto: {
      marginLeft: "auto",
    },
  })
);

const ProductTimelineComponent = () => {
  const classes = useStyles();
  const { id }: any = useParams();
  const [transactionData, setTransactionData] = useState<any>(null as any);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    //call to database to get product timeline details
    allTransactionRef.child(id).on("value", (snapshot) => {
      console.log(snapshot.val());
      setTransactionData(snapshot.val());
      setLoading(false);
    });
  }, [id]);

  return (
    <>
      <AppBar position="static"  className={classes.header}>
        <Container style={{ paddingLeft: 0 }}>
          <Toolbar className={clsx(classes.toolBar, "mobile-toolbar")}>
            <div className={classes.title}>
              <div>
                <img src={logo} alt="logo"  className={clsx(classes.logo, "mobile-logo")}/>
                {/* <MTypographyComponent
                  text="Product Supply Chain Infographic"
                  variant="h4"
                  classname={classes.pageTitle}
                /> */}
              </div>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <div className={clsx(classes.body, "mobile-body")}>
        {transactionData && (
          <>
            <Slide
              direction="up"
              timeout={500}
              in={true}
              mountOnEnter
              unmountOnExit
            >
              <div className={classes.productInfo}>
                <ProductInfoCardComponent
                  productInfo={transactionData.productInfo}
                  transactionData={transactionData}
                />
              </div>
            </Slide>
            <div className={clsx(classes.timeline, "mobile-timeline")}>
              <DistributorInfo
                classes={classes}
                userInfo={transactionData.userInfo}
                txRecords={transactionData.txRecords}
              />
              <TransporterInfo
                classes={classes}
                userInfo={transactionData.userInfo}
                txRecords={transactionData.txRecords}
              />
              <RetailerInfo
                classes={classes}
                userInfo={transactionData.userInfo}
                txRecords={transactionData.txRecords}
              />
              {transactionData?.customerInfo && (
                <CustomerCardComponent
                  classes={classes}
                  userInfo={transactionData.userInfo}
                  txRecords={transactionData.txRecords}
                  customerRecords={transactionData.customerInfo}
                />
              )}
            </div>
          </>
        )}
        {loading && <MSpinnerComponent open={loading} />}
        {!loading && !transactionData && (
          <Fade in={true} timeout={500}>
            <div className={classes.notAvailableRoot}>
              <NotAvailableComponent />
            </div>
          </Fade>
        )}
      </div>
      <AppFooterComponent footerText={APP_FOOTER_TEXT} />
    </>
  );
};

export default ProductTimelineComponent;
