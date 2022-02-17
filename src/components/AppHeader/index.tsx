import React, { useContext, useState, useEffect, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MButtonComponent from "../../generic/MButton";
import { useHistory } from "react-router";
import Container from "@material-ui/core/Container";
import { UserInfoContext } from "../../context/UserContext";
import { IUserInfoContext } from "../../models/userInfo.interface";
import useIsAuthorized from "../../hooks/useIsAuthorized";
import { LoginContext } from "../../context/LoginContext";
import { ILoginContext } from "../../models/login.interface";
import logo from "../../assets/images/logo.svg";
import AccountUserIcon from "@material-ui/icons/AccountBox";
import useCustomTheme from "../../hooks/useCustomTheme";
type AppHeaderProps = {
  title: string;
};

const useStyles = makeStyles((useCustomTheme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#373737",
  },
  toolBar: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  title: {
    flexGrow: 1,
    // color: "#FDFAF6",
    fontWeight: 600,
  },
  loginTitle: {
    fontSize: "20px",
  },
  userName: {
    paddingRight: "5px",
    fontWeight: 600,
    cursor: "pointer",
  },
  showProfile: {
    display: "block",
    position: "absolute",
    top: "65px",
    background: "#fff",
    border: "1px solid #000",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
    color: useCustomTheme.palette.secondary.main,
    "& ul": {
      padding: "0",
      margin: "0",
      width: "120px",
      "& li": {
        padding: "5px",
        textAlign: "center",
        background: useCustomTheme.palette.primary.main,
        "& a": {
          color: "#373737",
        },
      },
    },
  },
  hideProfile: {
    display: "none",
  },
  profileIcon: {
    verticalAlign: "middle",
  },
  profileLink: {
    textDecoration: "none",
  },
  logOutBtn: {
    backgroundColor: "#4b4b4b",
    fontSize: "10px",
    width: "100%",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    "&:hover": {
      transform: "none",
    },
  },
  logo: {
    maxWidth: 200,
    verticalAlign: "middle",
    cursor: "pointer",
  },
}));

const AppHeaderComponent = ({ title }: AppHeaderProps) => {
  const classes = useStyles();
  const history = useHistory();

  const userInfoContext = useContext<IUserInfoContext>(UserInfoContext);
  const { userInfo, userInfoAction } = userInfoContext;

  const loginContext = useContext<ILoginContext>(LoginContext);
  const { loginInfo, storeLoginInfo } = loginContext;

  const isAuth = useIsAuthorized();


  const clickActionHandler: any = (
    e: React.MouseEvent<HTMLInputElement>,
    pageName: string
  ) => {
    history.push("/".concat(pageName));
  };

  const handleLogoutAction: React.MouseEventHandler = (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    userInfoAction.logout();
    storeLoginInfo({ ...loginInfo, userName: "", userAddress: "" });
    history.push("/");
  };
  const [toggleProfile, setToggleProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setToggleProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  return (
    <AppBar position="static" className={classes.root}>
      <Container>
        <Toolbar className={classes.toolBar}>
          <div className={classes.title}>
            <a
              onClick={(e) =>
                clickActionHandler(e, userInfo.userRoleName.toString())
              }
            >
              <img src={logo} alt="logo" className={classes.logo} />
            </a>
          </div>
          {title && userInfo.userName && (
            <Typography variant="h5" className={classes.title}>
              {title}
            </Typography>
          )}
          {isAuth && userInfo.userName && (
            <>
              <div
                className={classes.userName}
                ref={ref}
                onClick={() => {
                  setToggleProfile(!toggleProfile);
                }}
              >
                <AccountUserIcon className={classes.profileIcon} />{" "}
                <span>My Account</span>
                <div
                  className={
                    toggleProfile ? classes.showProfile : classes.hideProfile
                  }
                >
                  {userInfo.userName && userInfo.userAddress && (
                    <>
                      <ul>
                        <li onClick={(e) => clickActionHandler(e, "profile")}>
                          <a className={classes.profileLink}>My Profile</a>
                        </li>
                      </ul>
                      <MButtonComponent
                        variant="text"
                        label="Logout"
                        color="inherit"
                        classname={classes.logOutBtn}
                        clickHandler={handleLogoutAction}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          {title && !userInfo.userName && (
            <span className={classes.loginTitle}>{title}</span>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeaderComponent;
