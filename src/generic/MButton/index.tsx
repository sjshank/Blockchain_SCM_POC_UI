import React, { MouseEventHandler } from "react";
import Button from "@material-ui/core/Button";

type MButtonProps = {
  label: string;
  variant?: "text" | "outlined" | "contained" | any;
  color?: "inherit" | "primary" | "secondary" | "default" | any;
  size?: "small" | "medium" | "large" | any;
  disabled?: boolean;
  clickHandler?: MouseEventHandler;
  classname?: any;
  type?: "button" | "submit" | "reset" | any;
};

const MButtonComponent = ({
  label,
  variant,
  color,
  size,
  disabled = false,
  clickHandler,
  classname,
  type,
}: MButtonProps) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      type={type}
      disabled={disabled}
      onClick={clickHandler}
      className={classname}
    >
      {label}
    </Button>
  );
};

export default MButtonComponent;
