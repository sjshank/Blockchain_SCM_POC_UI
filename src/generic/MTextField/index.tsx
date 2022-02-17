import React, { ChangeEventHandler } from "react";
import TextField from "@material-ui/core/TextField";

type MTextFieldProps = {
  id: string;
  name: string;
  required?: boolean;
  label?: string;
  variant?: string | any;
  classname?: any;
  helpText?: string;
  inputProps?: object;
  value?: any;
  disabled?: boolean;
  type?: string;
  defaultValue?: any;
  multiline?: boolean;
  rows?: number;
  changeHandler?: (e: React.ChangeEvent<HTMLInputElement>, param?: any) => void;
  ref?: any;
};

const MTextFieldComponent = ({
  id,
  name,
  required,
  label,
  variant,
  classname,
  helpText,
  changeHandler,
  value,
  disabled,
  type,
  defaultValue,
  multiline,
  rows,
  ref,
}: MTextFieldProps) => {
  return (
    <TextField
      required={required}
      id={id}
      name={name}
      inputProps={{ type: type }}
      label={label}
      value={value}
      variant={variant}
      className={classname}
      helperText={helpText}
      disabled={disabled}
      onChange={changeHandler}
      defaultValue={defaultValue}
      multiline={multiline}
      rows={rows}
      ref={ref}
    />
  );
};

export default MTextFieldComponent;
