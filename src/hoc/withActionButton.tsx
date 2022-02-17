import { Fab } from "@material-ui/core";
import React from "react";
import MTooltipComponent from "../generic/MTooltip";

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const withActionButton = (
  WrappedComponent: any,
  title: string,
  disabled: boolean
): any => {
  const WithActionButton = (props: any) => {
    return (
      <>
        <MTooltipComponent title={title} placement="top">
          <span>
            <Fab
              size="small"
              color="primary"
              disabled={disabled}
              onClick={props.clickHandler}
            >
              <WrappedComponent />
            </Fab>
          </span>
        </MTooltipComponent>
      </>
    );
  };
  WithActionButton["displayName"] = `WithActionButton(${getDisplayName(
    WrappedComponent
  )})`;
  return React.memo(WithActionButton);
};

export default withActionButton;
