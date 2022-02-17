import React from "react";
import { RetailerContextProvider } from "../../context/RetailerContext";
import DashboardLayout from "../../layout/DashboardPage";
import { PHARMA_DASHBOARD_TITLE } from "../../utils/constants";
import AAPStoreComponent from "./Store";

const RetailerDashboardComponent = () => {
  return (
    <RetailerContextProvider>
      <DashboardLayout headerTitle={PHARMA_DASHBOARD_TITLE}>
        <AAPStoreComponent />
      </DashboardLayout>
    </RetailerContextProvider>
  );
};

export default RetailerDashboardComponent;
