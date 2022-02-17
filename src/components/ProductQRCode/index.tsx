import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import QRCode from "react-qr-code";
import MFormDialogComponent from "../../generic/MFormDialog";
import MButtonComponent from "../../generic/MButton";

type ProductQRCodeProps = {
  data: any;
  clickEvent?: any;
  mouseOverEvent?: any;
  dialogTitle?: string | any;
  dialogId?: string | any;
  isOpen?: true | false;
  closeDialog: any;
  uui?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    qrCodeIcon: {
      paddingLeft: 5,
      margin: 0,
      cursor: "zoom-in",
      "&:hover": {
        transform: "scale(1.2)",
        transition: "all 0.3s",
      },
    },
    qrCodeDisplay: {
      textAlign: "center",
      padding: 8,
    },
  })
);

const ProductQRCodeComponent = ({
  data,
  clickEvent,
  mouseOverEvent,
  dialogTitle,
  dialogId,
  isOpen = false,
  closeDialog,
  uui,
}: ProductQRCodeProps) => {
  const classes = useStyles();
  return (
    <>
      <div style={{ zoom: "24%", marginTop: -30, marginLeft: -50 }}>
        <QRCode value={data} />
      </div>
      {dialogId == uui && (
        <MFormDialogComponent
          title={dialogTitle}
          open={isOpen}
          dialogId={dialogId}
          fullWidth={true}
          maxWidth="sm"
          footerButtons={
            <MButtonComponent
              variant="outlined"
              label="Close"
              clickHandler={closeDialog}
            />
          }
        >
          <div className={classes.qrCodeDisplay}>
            <QRCode value={data} />
          </div>
        </MFormDialogComponent>
      )}
    </>
  );
};

export default ProductQRCodeComponent;
