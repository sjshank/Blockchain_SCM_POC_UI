import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Grid from "@material-ui/core/Grid";
import VerifiedIcon from "@mui/icons-material/Verified";
import { getFormattedDate } from "../../utils/helpers";
import { IUserInfo } from "../../models/userInfo.interface";
import MTypography from "../MTypography";
import Divider from "@material-ui/core/Divider";

type HeaderProps = {
  user: IUserInfo;
  userRole?: string | any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    barTitle: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    personIcon: {
      width: "2em !important",
      height: "2em !important",
      // marginTop: 12,
    },
    ulBox: {
      listStyle: "none",
      paddingLeft: 0,
      marginLeft: 12,
      fontWeight: 500,
      marginTop: 6,
      marginBottom: 6,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      letterSpacing: "0.00938em",
      lineHeight: 0.9,
    },
    truncate: {
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    statusBadge: {
      textAlign: "center",
      fontSize: 11,
      fontWeight: 600,
    },
  })
);

const UserInfoHeaderComponent = ({ user, userRole }: HeaderProps) => {
  const classes = useStyles();
  const populateSpanContent = (content: any) => {
    return (
      <span style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.54)" }}>
        {content}
      </span>
    );
  };
  return (
    <>
      <Grid container wrap="nowrap">
        <Grid item sm={11} zeroMinWidth>
          <Grid container wrap="nowrap">
            <Grid item sm={2}>
              <PersonPinIcon
                fontSize="large"
                style={{ verticalAlign: "bottom", color: "#373737" }}
                className={classes.personIcon}
              />
            </Grid>
            <Grid item>
              <ul className={classes.ulBox}>
                <li>
                  <MTypography
                    variant="h6"
                    component="h6"
                    classname={classes.barTitle}
                    text={user.userName}
                  />
                </li>
                <li>
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(0, 0, 0, 0.54)",
                      textTransform: "capitalize",
                    }}
                  >
                    {userRole}
                  </span>
                </li>
                <li>{populateSpanContent(user.userAddress)}</li>
                <li>
                  {populateSpanContent(getFormattedDate(user.registrationDate))}
                </li>
                <li>{populateSpanContent(user.userLocation)}</li>
              </ul>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={1} zeroMinWidth>
          {!user.isDeleted && (
            <VerifiedIcon fontSize="large" style={{ color: "#2FDD92" }} />
          )}
        </Grid>
      </Grid>
      <Divider />
    </>
  );
};

export default UserInfoHeaderComponent;
