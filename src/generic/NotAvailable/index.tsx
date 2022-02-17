import React from "react";
import MTypographyComponent from "../MTypography";

const NotAvailableComponent = () => {
  return (
    <MTypographyComponent
      text="Information is not available."
      variant="body2"
      style={{ padding: 20, textAlign: "center" }}
    />
  );
};

export default React.memo(NotAvailableComponent);
