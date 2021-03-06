import React from "react";
import MSimpleSelectComponent from "../../../generic/MBasicSelect";
import MSwitchComponent from "../../../generic/MSwitch";
import MTextFieldComponent from "../../../generic/MTextField";
import { USER_ROLES } from "../../../utils/constants";
import { IUserFields, useFormStyles } from "../helper";

type UserFormProps = {
  userState: IUserFields;
  handleInputChange: any;
  isEditMode: boolean;
};

const UserFormComponent = ({
  userState,
  handleInputChange,
  isEditMode = false,
}: UserFormProps) => {
  const formClasses = useFormStyles();
  return (
    <div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="fullName"
          name="fullName"
          label="Full Name"
          variant="outlined"
          value={userState.fullName}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          value={userState.email}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="userName"
          name="userName"
          label="User Name"
          variant="outlined"
          disabled={isEditMode}
          value={userState.userName}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="userAddress"
          name="userAddress"
          label="Wallet Address"
          variant="outlined"
          disabled={isEditMode}
          value={userState.userAddress}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="phone"
          name="phone"
          label="Phone Number"
          type="number"
          variant="outlined"
          value={userState.phone}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MTextFieldComponent
          required={true}
          id="userLocation"
          name="userLocation"
          label="Location"
          variant="outlined"
          value={userState.userLocation}
          classname={formClasses.textField}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MSimpleSelectComponent
          required={true}
          id="userRole"
          name="userRole"
          label="Select Role"
          variant="outlined"
          disabled={isEditMode}
          selectedValue={userState.userRole}
          options={USER_ROLES.DEFAULT.map((uRole) => {
            return { key: uRole.roleName, value: uRole.roleCode };
          })}
          classname={formClasses.select}
          changeHandler={handleInputChange}
        />
      </div>
      <div className={formClasses.textFieldBar}>
        <MSwitchComponent
          required={true}
          id="userStatus"
          name="userStatus"
          label="Status"
          labelPlacement="end"
          switchClassname={formClasses.switch}
          switchColor="primary"
          checked={userState.userStatus}
          changeHandler={handleInputChange}
        />
      </div>
    </div>
  );
};

export default UserFormComponent;
