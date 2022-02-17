import React, { ReactNode } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { APP_DESC, APP_FOOTER_TEXT, APP_TITLE } from "../../utils/constants";
import AppFooterComponent from "../../components/AppFooter";
import Grid from "@mui/material/Grid";
import AppHeaderComponent from "../../components/AppHeader";

type LandingPageProps = {
  children: React.ReactNode[];
  toggleTheme?: () => void;
  useDefaultTheme?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    content: {
      flexGrow: 1,
      minHeight: `calc(100vh - 50px)`,
    },
    toolbar: {
      ...theme.mixins.toolbar,
    },
    heroSectionImage: {
      maxWidth: "100%",
      width: "100%",
      height: "100%",
      minHeight: "450",
      filter: "brightness(0.3)",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      boxShadow: "10px 10px 5px #cccccc6b",
    },
    heroSectionTxt: {
      backgroundColor: "rgba(0,0,0, 0.4)",
      color: "white",
      border: "3px solid #f1f1f1",
      borderRadius: "5px",
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      width: "80%",
      padding: "10px",
      textAlign: "center",
      opacity: 1.5,
      filter: "brightness(1.5)",
      zoom: 1.1,
    },
  })
);

const DigitalContractPageLayout = ({
  toggleTheme,
  useDefaultTheme,
  children,
}: LandingPageProps) => {
  const classes = useStyles();

  return (
    <CssBaseline>
      <div className={classes.root}>
        <AppHeaderComponent title="Digital Agreement" />
        <main className={classes.content}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={3} sm={3} md={3}>
              {children[0]}
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              {children[1]}
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              {children[2]}
            </Grid>
          </Grid>
        </main>
        <AppFooterComponent footerText={APP_FOOTER_TEXT} />
      </div>
    </CssBaseline>
  );
};

export default DigitalContractPageLayout;
