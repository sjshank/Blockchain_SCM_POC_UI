import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import MBasicTableComponent from "../MBasicTable";
import PaperHeaderComponent from "../../components/PaperHeader";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import { IUserInfo } from "../../models/userInfo.interface";
import useTableHeaders from "../../hooks/useTableHeaders";
import MTableHeadersComponent from "../TableHeaders";
import MTableCellComponent from "../MTableCell";
import NoRecordsComponent from "../NoRecordsFound";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SignalWifiStatusbarConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4";
import MTooltipComponent from "../MTooltip";

type UserListProps = {
  label: string;
  tableName: string;
  tableId: string;
  color: string;
  users: Array<IUserInfo>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      minHeight: "200px",
      maxHeight: "300px",
    },
    label: {
      display: "flex",
      justifyContent: "start",
      textAlign: "left",
      // color: "#053742",
    },
    icon: {
      textAlign: "left",
      marginRight: "4px",
    },
    tableHeadCell: {
      fontSize: 15,
      padding: "8px",
      color: "rgba(0, 0, 0, 0.54)",
      fontWeight: theme.typography.fontWeightBold,
    },
    tableBodyCell: {
      fontSize: 12,
      padding: "8px",
    },
    roleChip: {
      fontSize: 12,
      width: "194px",
    },
  })
);

const UserListComponent = ({
  label,
  tableName,
  tableId,
  color,
  users,
}: UserListProps) => {
  const classes = useStyles();
  const tableHeaders = useTableHeaders("userInfo");

  const populateTableBody = () => {
    return (
      <TableBody>
        {users.length === 0 && (
          <NoRecordsComponent length={tableHeaders.length} />
        )}
        {users.map((row: IUserInfo) => (
          <TableRow key={row.userAddress}>
            <TableCell align="left" className={classes.tableBodyCell}>
              <span>{row.userName}</span>
            </TableCell>
            <MTableCellComponent
              classname={classes.tableBodyCell}
              text={row.userAddress}
            />
            <MTableCellComponent
              classname={classes.tableBodyCell}
              text={row.userLocation}
            />
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <Paper className={classes.root} elevation={3} square={true}>
      <PaperHeaderComponent
        IconComp={
          <SupervisedUserCircleOutlinedIcon style={{ color: "#cc3300" }} />
        }
        label={label}
        textVariant="button"
      />
      <MBasicTableComponent
        tableBody={populateTableBody()}
        tableHeader={
          <MTableHeadersComponent
            tableHeaders={tableHeaders}
            classes={classes}
          />
        }
        tableName={tableName}
        tableId={tableId}
        height="220px"
        stickyHeader={true}
      />
    </Paper>
  );
};

export default UserListComponent;
