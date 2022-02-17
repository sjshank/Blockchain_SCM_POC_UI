import React from "react";
import InsertDriveFileTwoToneIcon from "@mui/icons-material/InsertDriveFileTwoTone";

type AgreementProps = {
  size?: "inherit" | "large" | "medium" | "small";
};

const AgreementIcon = ({ size = "large" }: AgreementProps) => {
  return (
    <InsertDriveFileTwoToneIcon
      fontSize={size}
      style={{ color: "#1976d2", cursor: "pointer" }}
    />
  );
};

export default AgreementIcon;
