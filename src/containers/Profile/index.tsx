import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useContext } from "react";
import DashboardLayout from "../../layout/DashboardPage";
import { PROFILE_DASHBOARD_TITLE } from "../../utils/constants";
import { UserInfoContext } from "../../context/UserContext";
import { IUserInfoContext } from "../../models/userInfo.interface";
import AccountUserIcon from "@material-ui/icons/AccountTree";
import LocationIcon from "@material-ui/icons/LocationOn";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router";
import MButtonComponent from "../../generic/MButton";
import { getFormattedDate } from "../../utils/helpers";
import { IWeb3State } from "../../models/web3.interface";
import { Web3Context } from "../../context/Web3Context";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SignalWifiStatusbarConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4";

declare const window: Window &
  typeof globalThis & {
    WEB3: any;
  };

const useStyles = makeStyles((useCustomTheme) => ({
  container: {
    border: "1px solid #373737",
    borderRadius: "5px",
    width: "60%",
    minWidth: "350px",
    margin: "20px auto",
  },
  avatar: {
    marginRight: "20px",
    textAlign: "center",
    padding: "10px",
  },
  avatarIcon: {
    margin: "0 auto",
    width: "100px",
    height: "100px",
    fontSize: "40px",
    backgroundColor: useCustomTheme.palette.secondary.main,
  },
  titleContainer: {
    width: "60%",
    minWidth: "350px",
    margin: "0px auto",
    display: "flex",
  },
  title: {
    backgroundColor: useCustomTheme.palette.primary.main,
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    borderBottom: "1px solid #373737",
    padding: "5px 10px",
    fontWeight: "bold",
  },
  headers: {
    margin: "5px 0",
    textTransform: "capitalize",
  },
  roleIcon: {
    verticalAlign: "middle",
    fontSize: "1.2rem",
    marginRight: "5px",
    color: useCustomTheme.palette.secondary.main,
  },
  row: {
    display: "flex",
    padding: "10px 0",
    "& label": {
      width: "200px",
      paddingLeft: "10px",
      textAlign: "left",
      color: "#666",
    },
    "& span": {
      width: "50%",
      wordBreak: "break-all",
      fontWeight: 500,
    },
  },
  backBtn: {
    backgroundColor: "#4b4b4b",
    padding: "5px 10px",
    color: "#fff",
    borderRadius: "5px",
    margin: "10px",
    minWidth: "100px",
    textTransform: "capitalize",
  },
}));
const ProfileDashboardBoardComponent = () => {
  const web3Context = useContext<IWeb3State>(Web3Context);
  const { web3, selectedAccountBal } = web3Context;

  const userInfoContext = useContext<IUserInfoContext>(UserInfoContext);
  const { userInfo } = userInfoContext;
  const classes = useStyles();
  const regDate = new Date(parseInt(userInfo.registrationDate) * 1000).toLocaleDateString();
  const history = useHistory();

  const handleBackAction: React.MouseEventHandler = (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    history.push(userInfo.userRoleName.toString());
  };

  return (
    <DashboardLayout headerTitle={PROFILE_DASHBOARD_TITLE}>
      <div className={classes.titleContainer}>
        <div className={classes.avatar}>
          <Avatar className={classes.avatarIcon}>
            {userInfo.fullName && userInfo.fullName.split(" ")[0][0]}
            {userInfo.fullName &&
              userInfo.fullName.split(" ")[1] &&
              userInfo.fullName.split(" ")[1][0]}
          </Avatar>
        </div>
        <div>
          <h1 className={classes.headers}>{userInfo.fullName}</h1>
          <h4 className={classes.headers}>
            <AccountUserIcon className={classes.roleIcon} />
            {userInfo.userRoleName}
          </h4>
          <h4 className={classes.headers}>
            <LocationIcon className={classes.roleIcon} />{" "}
            {userInfo.userLocation}
          </h4>
        </div>
      </div>

      <div className={classes.container}>
        <div className={classes.title}>Account Details</div>
        <div className={classes.row}>
          <label>User Name : </label>
          <span>{userInfo.userName}</span>
        </div>
        <div className={classes.row}>
          <label>Phone number : </label>
          <span>{userInfo.phone}</span>
        </div>
        <div className={classes.row}>
          <label>Email : </label>
          <span>{userInfo.email}</span>
        </div>
        <div className={classes.row}>
          <label>Status : </label>
          <span>
            {userInfo.userStatus}
            {userInfo.isDeleted ? (
              <SignalWifiStatusbarConnectedNoInternet4Icon
                fontSize="small"
                style={{
                  color: "#6B4F4F",
                  marginLeft: 3,
                }}
              />
            ) : (
              <SignalWifiStatusbar4BarIcon
                fontSize="small"
                style={{
                  color: "#6ECB63",
                  marginLeft: 3,
                }}
              />
            )}
          </span>
        </div>
        <div className={classes.row}>
          <label>Active from : </label>
          <span>{regDate}</span>
        </div>
        <div className={classes.row}>
          <label>Ethereum Address : </label>
          <span>{userInfo.userAddress}</span>
        </div>
        <div className={classes.row}>
          <label>Account Balance (In ETH) : </label>
          <span>{selectedAccountBal} ETH</span>
        </div>
        <div className={classes.row}>
          <MButtonComponent
            variant="text"
            label="Back"
            color="inherit"
            classname={classes.backBtn}
            clickHandler={handleBackAction}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileDashboardBoardComponent;
