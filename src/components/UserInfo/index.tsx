import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  CardContent,
  CardActions,
  CardHeader,
} from "@material-ui/core";
import PersonPinIcon from "../../assets/images/user.png";
import comments from "../../assets/images/comments.png";
import commentsLeft from "../../assets/images/comments-left.png";
//import Avatar from "@material-ui/core/Avatar";
import { Card } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarIcon: {
      width: "33%",
      minWidth: "80px",
    },
    scale: {
      transform: "scaleX(-1)",
    },
    titleContainer: {
      minWidth: "350px",
      margin: "0px auto",
      display: "flex",
    },
    card: {
      padding: "10px",
      backgroundColor: "transparent",
      margin: "30% auto",
      height: "215px",
      backgroundImage: "url(" + comments + ")",
      backgroundSize: "100%",
      backgroundRepeat: "no-repeat",
      width: "75%",
      textAlign: "center",
      boxShadow: "none",
    },
    flip: {
      backgroundImage: "url(" + commentsLeft + ")",
    },
    cardHeaderTitle: {
      fontSize: "1.2rem",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      lineHeight: 1.334,
      letterSpacing: "0em",
      margin: 0,
      color: "#373737",
    },
    cardHeaderSubTitle: {
      color: "rgba(0, 0, 0, 0.54)",
      textTransform: "capitalize",
      fontSize: 14,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      lineHeight: 1.5,
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
      display: "block",
    },
    statusIcon: {
      width: "1.5em !important",
      height: "1.5em !important",
    },
    addrTxt: {
      fontSize: 10,
      wordBreak: "break-all",
    },
  })
);
const UserInfo = (props) => {
  const { userDetails } = props;
  const classes = useStyles();
  console.log(userDetails);
  return (
    <>
      <Card
        className={`${classes.card} ${
          props.role == "Retailer" ? classes.flip : ""
        }`}
      >
        <img
          src={PersonPinIcon}
          className={`${classes.avatarIcon} ${
            props.role == "Distributor" ? classes.scale : ""
          }`}
        />
        <CardContent style={{ padding: 10 }}>
          <span className={classes.cardHeaderTitle}>
            {userDetails.userName}
          </span>
          <span className={classes.cardHeaderSubTitle}>{props.role}</span>
        </CardContent>
      </Card>
    </>
  );
};

export default UserInfo;
