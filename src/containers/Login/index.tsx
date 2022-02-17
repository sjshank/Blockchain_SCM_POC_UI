import React from "react";
import LoginFormComponent from "./LoginForm";
import LandingPageLayout from "../../layout/LandingPage";
import { LoginContextProvider } from "../../context/LoginContext";
import AppHeaderComponent from "../../components/AppHeader";
import { APP_TITLE } from "../../utils/constants";


type LoginProps = {};

const LoginComponent = () => {
  return (
    <LandingPageLayout>
      <LoginContextProvider>
      <AppHeaderComponent title={APP_TITLE} />      
        <LoginFormComponent />
      </LoginContextProvider>
    </LandingPageLayout>
  );
};

export default LoginComponent;
