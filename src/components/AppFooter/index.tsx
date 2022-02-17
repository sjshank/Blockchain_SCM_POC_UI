import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
type AppFooterProps = {
  footerText: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    padding: theme.spacing(0.5),
    boxShadow: theme.shadows[4],
    borderTop: "2px solid #053742",
    display: "flex",
    justifyContent: "center",
  },
  footerInner: {
    display: "flex",
    justifyContent: "space-between",
    "& ul": {
      padding: "0",
      "& li": {
        display: "inline-block",
        marginRight: "30px",
        fontSize: "13px",
        color: "#666",
        "& a": {
          textDecoration: "none",
          color: "#666",
        },
      },
    },
    "& p": {
      color: "#666",
    },
  },
}));

const AppFooterComponent = ({ footerText }: AppFooterProps) => {
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      <Container>
        {/*<small>
        {footerText}
        <a href="https://advanceautoparts.atlassian.net/wiki/spaces/CCLIMB/overview" target="_blank">GCC Innovation Team</a>
      </small>*/}
        <div className={classes.footerInner}>
          <ul>
            <li>© 2021 Advance Auto Parts</li>
            <li>
              <a href="https://shop.advanceautoparts.com/o/privacy-notice">
                Privacy Notice{" "}
              </a>
            </li>
            <li>
              <a href="https://shop.advanceautoparts.com/o/termscond">
                Terms of Use
              </a>
            </li>
            <li>
              <a href="https://shop.advanceautoparts.com/o/sitemap">Site Map</a>
            </li>
          </ul>
          <p>
            ADVANCING A WORLD IN MOTION<sup>®</sup>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default AppFooterComponent;
