import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MTextFieldComponent from "../../generic/MTextField";
import { ICustomer } from "../../models/customer.interface";
import TextareaAutosize from "@mui/base/TextareaAutosize";

type CustomerFormProps = {
  customerFormState: ICustomer;
  handleInputChange: any;
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

const CustomerFormComponent = ({
  customerFormState,
  handleInputChange,
}: CustomerFormProps) => {
  let classes = useFormStyles();
  return (
    <div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="customerName"
          name="customerName"
          label="Customer Name"
          variant="outlined"
          value={customerFormState.customerName}
          classname={classes.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="customerAddress"
          name="customerAddress"
          label="Correspondent Address"
          variant="outlined"
          value={customerFormState.customerAddress}
          classname={classes.textField}
          changeHandler={handleInputChange}
          multiline={true}
          rows={3}
        />
      </div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="quantity"
          name="quantity"
          type="number"
          label="Quantity (In Numbers)"
          variant="outlined"
          value={customerFormState.quantity}
          classname={classes.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="amountPaid"
          name="amountPaid"
          type="number"
          disabled={true}
          label="Amount Paid (In USD)"
          variant="outlined"
          value={customerFormState.amountPaid}
          classname={classes.textField}
          changeHandler={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CustomerFormComponent;
