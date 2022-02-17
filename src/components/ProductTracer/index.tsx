import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import MTooltipComponent from "../../generic/MTooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { getProductURL } from "../../utils/helpers";
import { IProductBasicInfo } from "../../models/product.interface";

type ProductTrackerProps = {
  data: IProductBasicInfo;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    showMoreIcon: {
      paddingLeft: 5,
      margin: 0,
      cursor: "pointer",
      "&:hover": {
        transform: "scale(1.2)",
        transition: "all 0.3s",
      },
    },
  })
);

const ProductTracerComponent = ({ data }: ProductTrackerProps) => {
  const classes = useStyles();
  const handleViewUpdatesEvent = () => {
    window.open(getProductURL(data.productId), "_blank");
  };

  return (
    <MTooltipComponent title="View Updates" placement="top">
      <p className={classes?.showMoreIcon} onClick={handleViewUpdatesEvent}>
        <VisibilityIcon />
      </p>
    </MTooltipComponent>
  );
};

export default React.memo(ProductTracerComponent);
