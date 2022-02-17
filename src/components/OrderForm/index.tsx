import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MTextFieldComponent from "../../generic/MTextField";
import { IOrder } from "../../models/order.interface";
import MSimpleSelectComponent from "../../generic/MBasicSelect";
import { getUserListForDropdown } from "../../utils/helpers";
import { IUserInfo } from "../../models/userInfo.interface";

type OrderFormProps = {
  orderFormState: IOrder;
  handleInputChange: any;
  userList: Array<IUserInfo>;
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

const OrderFormComponent = ({
  orderFormState,
  handleInputChange,
  userList,
}: OrderFormProps) => {
  let classes = useFormStyles();
  const result = getUserListForDropdown(userList);
  return (
    <div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="productName"
          name="productName"
          label="Product Name"
          variant="outlined"
          value={orderFormState.productName}
          classname={classes.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={false}
          id="productDesc"
          name="productDesc"
          label="Product Description"
          variant="outlined"
          value={orderFormState.productDesc}
          classname={classes.textField}
          changeHandler={handleInputChange}
          multiline={true}
          rows={3}
          helpText="Description must contain necessary details such as product code, dimension, material etc."
        />
      </div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="manufacturerDetail"
          name="manufacturerDetail"
          label="Manufacturer Name"
          variant="outlined"
          value={orderFormState.manufacturerDetail}
          classname={classes.textField}
          changeHandler={handleInputChange}
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
          value={orderFormState.quantity}
          classname={classes.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={classes.textFieldBar}>
        <MSimpleSelectComponent
          required={true}
          id="distributor"
          name="distributor"
          label="Product Distributor"
          variant="outlined"
          selectedValue={orderFormState.distributor}
          options={result.distributors ? result.distributors : []}
          helpText="Distributor wallet address"
          classname={classes.select}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={classes.textFieldBar}>
        <MTextFieldComponent
          required={false}
          id="notes"
          name="notes"
          label="Additional Notes"
          variant="outlined"
          value={orderFormState.notes}
          classname={classes.textField}
          changeHandler={handleInputChange}
          multiline={true}
          rows={3}
        />
      </div>
    </div>
  );
};

export default OrderFormComponent;
