import React from "react";
import NotAvailableComponent from "../../generic/NotAvailable";
import withUserInfo from "../../hoc/withUserInfo";
import { IUserInfo } from "../../models/userInfo.interface";
import "./style.css";
import { getRoleBasedTxRecords } from "../../utils/helpers";
import EventComponent from "../../generic/Event";

type InfoProps = {
  classes: any;
  userInfo: IUserInfo;
  txRecords: any;
};

const DistributorInfoComponent = ({
  classes,
  userInfo,
  txRecords,
}: InfoProps) => {
  return (
    <EventComponent
      txRecords={getRoleBasedTxRecords(txRecords, "distributor")}
    />
  );
};

export default withUserInfo(DistributorInfoComponent, "left", "distributor");
