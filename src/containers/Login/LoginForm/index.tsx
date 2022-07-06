import React, { MouseEventHandler, useState, useRef, useContext } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MButtonComponent from "../../../generic/MButton";
import MTypographyComponent from "../../../generic/MTypography";
import MTextFieldComponent from "../../../generic/MTextField";
import { useHistory } from "react-router";
import { Web3Context } from "../../../context/Web3Context";
import { IWeb3State } from "../../../models/web3.interface";
import { SpinnerContext } from "../../../context/SpinnerContext";
import { ISpinnerState } from "../../../models/spinner.interface";
import { IUserInfoContext } from "../../../models/userInfo.interface";
import { UserInfoContext } from "../../../context/UserContext";
import {
  AUTHENTICATION_SUCCESS,
  ROLE_BASED_ROUTES,
  USER_ROLE_LIST,
} from "../../../utils/constants";
import { ILoginContext } from "../../../models/login.interface";
import { LoginContext } from "../../../context/LoginContext";
import { useEffect } from "react";
import {
  getTransactionData,
  sendTransaction,
} from "../../../services/contractAPI";
import { ToastContext } from "../../../context/ToastContext";
import Container from "@material-ui/core/Container";
import banner from "../../../assets/images/banner.jpg";
const useFormStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: theme.spacing(4),
    backgroundImage: `url(${banner})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right center",
    height: "calc(100vh - 115px)",
  },
  customContainer:{
    display:"flex"
  },
  loginHeader: {
    "& h5": {
      color: "#cc3300",
      fontSize: "28px",
      fontWeight: "bold",
      margin: "10px auto 15px",
    },
  },
  textFieldBar: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  textField: {
    width: "310px",
  },
  innerForm: {
    maxWidth: "350px",
    minHeight: "400px",
    padding: "10px 20px",
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  rightContent:{
    padding:"45px 20px",
    color:"#f0f0d5",
    backgroundColor:"rgba(0,0,0,0.65)",    
    borderRadius: "5px",
    margin: "20% 10%"
    /*position: "absolute",
    width: "50%",
    top: "40%",
    left: "40%"*/
  }
}));

const LoginFormComponent = () => {
  const formClasses = useFormStyles();
  const web3Context = useContext<IWeb3State>(Web3Context);
  const { contractInstance, selectedAccount } = web3Context;

  const spinnerContext = useContext<ISpinnerState>(SpinnerContext);
  const { toggleSpinner } = spinnerContext;

  const userInfoContext = useContext<IUserInfoContext>(UserInfoContext);
  const { userInfoAction } = userInfoContext;

  const loginContext = useContext<ILoginContext>(LoginContext);
  const { loginInfo, storeLoginInfo } = loginContext;

  const toastContext = useContext<any>(ToastContext);
  const { toggleToast } = toastContext;

  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    if (loginInfo && loginInfo.userAddress != "" && loginInfo.userName != "") {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [loginInfo]);

  const inputChangeHandler = (e: any) => {
    storeLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitClick: MouseEventHandler = async (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    try {
      toggleSpinner();
      const result = sendTransaction(
        contractInstance,
        "validateUser",
        selectedAccount,
        loginInfo.userAddress,
        loginInfo.userName
      );
      result
        .then((res: any) => {
          toggleToast("success", AUTHENTICATION_SUCCESS);
          if (res.status) {
            const _userInfo = getTransactionData(
              contractInstance,
              "getUserInfo",
              selectedAccount,
              loginInfo.userAddress
            );
            _userInfo.then((user: any) => {
              let _userDetails = {
                ...user,
                userRole: parseInt(user.userRole),
                userRoleName: USER_ROLE_LIST[parseInt(user.userRole)],
              };
              userInfoAction.setUserInfo(_userDetails);
              history.push(ROLE_BASED_ROUTES[_userDetails.userRoleName]);
            });
          }
        })
        .catch((e: any) => {
          toggleToast("error", e?.errorMessage);
        })
        .finally(() => {
          toggleSpinner();
        });
    } catch (e: any) {
      toggleSpinner();
      toggleToast("error", e?.errorMessage);
    }
  };

  return (
    <form noValidate className={formClasses.root}>
      <Container className={formClasses.customContainer}>
        <div className={formClasses.innerForm}>
          <div className={formClasses.loginHeader}>
            <MTypographyComponent
              variant="h4"
              component="h5"
              color="primary"
              align="center"
              text="Sign In"
            />
          </div>
          <div className={formClasses.textFieldBar}>
            <MTextFieldComponent
              required={true}
              id="userName"
              name="userName"
              label="User Name"
              variant="outlined"
              classname={formClasses.textField}
              changeHandler={(e) => inputChangeHandler(e)}
              value={loginInfo.userName}
              helpText="Username is case sensitive"
            />
          </div>
          <div className={formClasses.textFieldBar}>
            <MTextFieldComponent
              required={true}
              id="userAddress"
              name="userAddress"
              label="Account Address"
              variant="outlined"
              classname={formClasses.textField}
              helpText="Ethereum account address"
              changeHandler={(e) => inputChangeHandler(e)}
              value={loginInfo.userAddress}
            />
          </div>
          <div>
            <MButtonComponent
              label="Submit"
              color="primary"
              variant="contained"
              size="medium"
              disabled={btnDisabled}
              clickHandler={handleSubmitClick}
            />
          </div>
        </div>
        <div>
        <p className={formClasses.rightContent}>
          The Blockchain technology based solution will enable streamlined visibility of movement and stakeholders through which products transit. The improved traceability facilitates the optimization of flows of goods and an efficient stock management system.
        </p>
        </div>
      </Container>
    </form>
  );
};

export default React.memo(LoginFormComponent);
