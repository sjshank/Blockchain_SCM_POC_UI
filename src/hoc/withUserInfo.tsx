import React from "react";
import Slide from "@material-ui/core/Slide";
import clsx from "clsx";
import Divider from "@material-ui/core/Divider";
import UserInfoHeaderComponent from "../generic/UserInfoHeaderComponent";
import { IUserInfo } from "../models/userInfo.interface";

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const withUserInfo = (
  WrappedComponent: React.ComponentType<any>,
  slideDirection: "left" | "right" | "up" | "down",
  userRole: string
): React.ReactNode => {
  class WithUserInfo extends React.Component {
    render() {
      const classes: any = this.props["classes"];
      const userInfo: any = this.props["userInfo"][userRole];
      return (
        <div>
          <Slide
            direction={slideDirection}
            timeout={500}
            in={true}
            mountOnEnter
            unmountOnExit
          >
            <div
              className={clsx(
                classes.timelineContainer,
                classes[`${slideDirection === "right" ? "left" : "right"}`],
                "mobile-timelineContainer"
              )}
            >
              <div
                className={clsx(
                  classes.content,
                  classes[
                    `${slideDirection === "right" ? "marginLeftAuto" : ""}`
                  ],
                  "mobile-timeline-content"
                )}
                style={{ marginTop: 10 }}
              >
                {userInfo && (
                  <UserInfoHeaderComponent
                    user={userInfo}
                    userRole={userRole}
                  />
                )}
                <WrappedComponent {...this.props} />
              </div>
            </div>
          </Slide>
        </div>
      );
    }
  }
  WithUserInfo["displayName"] = `WithUserInfo(${getDisplayName(
    WrappedComponent
  )})`;
  return WithUserInfo;
};

export default withUserInfo;
