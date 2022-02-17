import React from "react";
import EventComponent from "../../generic/Event";
import withUserInfo from "../../hoc/withUserInfo";
import { IUserInfo } from "../../models/userInfo.interface";
import { getRoleBasedTxRecords } from "../../utils/helpers";

type InfoProps = {
  classes: any;
  userInfo: IUserInfo;
  txRecords: any;
};

const TransporterInfoComponent = ({
  classes,
  userInfo,
  txRecords,
}: InfoProps) => {
  return (
    <EventComponent
      txRecords={getRoleBasedTxRecords(txRecords, "transporter")}
    />
  );
};

export default withUserInfo(TransporterInfoComponent, "right", "transporter");
