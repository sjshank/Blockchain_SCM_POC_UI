import React from "react";
import { IProduct } from "../../../models/product.interface";
import { makeStyles } from "@material-ui/core/styles";
import MTextFieldComponent from "../../../generic/MTextField";

type CancelFormProps = {
  productFormState: IProduct;
  handleInputChange?: any;
};

const useFormStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: theme.spacing(4),
  },
  textFieldBar: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  textField: {
    width: "100%",
  },
  select: {
    width: "100%",
  },
}));

const CancellationFormComponent = ({
  productFormState,
  handleInputChange,
}: CancelFormProps) => {
  let formClasses = useFormStyles();
  return (
    <div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="reasonForShipmentCancellation"
          name="reasonForShipmentCancellation"
          label="Reason For Cancellation"
          variant="outlined"
          multiline={true}
          rows={3}
          value={
            productFormState.productAdvanceInfo.reasonForShipmentCancellation
          }
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CancellationFormComponent;
