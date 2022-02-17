import React from "react";
import MTypographyComponent from "../../generic/MTypography";

const TransferPolicy = () => {
  return (
    <>
      <MTypographyComponent
        text="I agree that following transfer protocol has been processed for the selected batch."
        variant="subtitle1"
      />

      <ul style={{ listStyle: "inside" }}>
        <li>
          <MTypographyComponent
            text="Package is neither intacted nor in a flawless condition."
            variant="caption"
          />
        </li>
        <li>
          <MTypographyComponent
            text="Seal of package is not damaged."
            variant="caption"
          />
        </li>
        <li>
          <MTypographyComponent
            text="QRcode and RFID matches the shipping note."
            variant="caption"
          />
        </li>
        <li>
          <MTypographyComponent
            text="I confirm, package has passed all the preliminary terms and conditions."
            variant="caption"
          />
        </li>
      </ul>
    </>
  );
};

export default TransferPolicy;
