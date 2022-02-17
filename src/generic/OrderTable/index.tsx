import React, { useContext } from "react";
import MBasicTableComponent from "../MBasicTable";
import MTableHeadersComponent from "../TableHeaders";
import useTableHeaders from "../../hooks/useTableHeaders";
import { ROLE_BRAND } from "../../utils/constants";
import { createStyles, makeStyles, Theme, Fade } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import UserBadgeComponent from "../../generic/UserBadge";
import NoRecordsComponent from "../../generic/NoRecordsFound";
import { IUserInfo, IUserInfoContext } from "../../models/userInfo.interface";
import { UserInfoContext } from "../../context/UserContext";
import _ from "lodash";
import { IOrder } from "../../models/order.interface";
import OrderTitleComponent from "../../components/OrderTitle";

type OrderTableProps = {
  dataList: IOrder[];
  userList: IUserInfo[];
  tableHeaderIdentifier: string;
  tableName: string;
  tableId: string;
  height?: string;
  getColumns: any;
  dialogStatus?: any;
  closeDialog?: any;
  showManufacturerCol?: boolean;
  showShipperCol?: boolean;
  showDistributorCol?: boolean;
  showRetailCol?: boolean;
};

const OrderTable = ({
  dataList,
  userList,
  getColumns,
  tableHeaderIdentifier,
  tableName,
  tableId,
  height,
  dialogStatus,
  closeDialog,
  showManufacturerCol = false,
  showShipperCol = false,
  showDistributorCol = false,
  showRetailCol = false,
}: OrderTableProps) => {
  const tableHeaders = useTableHeaders(tableHeaderIdentifier);
  const userInfoContext = useContext<IUserInfoContext>(UserInfoContext);
  const { userInfo } = userInfoContext;

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      tableHeadCell: {
        fontSize: 15,
        padding: "4px",
        color: "rgba(0, 0, 0, 0.54)",
        fontWeight: theme.typography.fontWeightBold,
      },
      tableBodyCell: {
        fontSize: 12,
        padding: "4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "pre-wrap",
        verticalAlign: "middle",
        // width: "300px",
      },
      statusChip: {
        width: "100%",
        backgroundColor: "#381460",
        color: "#fff",
      },
      fabBtn: {
        color: ROLE_BRAND[userInfo?.userRoleName?.toLowerCase()]["bgColor"],
        fontSize: 10,
        fontWeight: 600,
        marginLeft: 5,
        marginRight: 5,
        "&:hover": {
          color: "#fff",
          backgroundColor:
            ROLE_BRAND[userInfo?.userRoleName?.toLowerCase()]["bgColor"],
        },
      },
      statusCheckbox: {
        color: `${
          ROLE_BRAND[userInfo?.userRoleName?.toLowerCase()]["bgColor"]
        }`,
        marginLeft: 8,
      },
    })
  );
  const classes = useStyles();

  const populateTableBody = (): any => {
    return (
      <Fade in={true} timeout={1000}>
        <TableBody>
          {dataList.length === 0 && (
            <NoRecordsComponent length={tableHeaders.length} />
          )}
          {dataList.map((row: IOrder) => (
            <Fade in={true} timeout={200} key={row.orderRequestId}>
              <TableRow key={row.orderRequestId}>
                <TableCell
                  align="left"
                  className={classes.tableBodyCell}
                  style={{ width: 350, wordBreak: "break-word" }}
                >
                  <OrderTitleComponent orderData={row} />
                </TableCell>
                <TableCell align="left" className={classes.tableBodyCell}>
                  {row.quantity}
                </TableCell>
                {showRetailCol && (
                  <TableCell align="left" className={classes.tableBodyCell}>
                    <UserBadgeComponent
                      title={row.retailer}
                      users={userList}
                      role="3"
                    />
                  </TableCell>
                )}
                {showDistributorCol && (
                  <TableCell align="left" className={classes.tableBodyCell}>
                    <UserBadgeComponent
                      title={row.distributor}
                      users={userList}
                      role="2"
                    />
                  </TableCell>
                )}
                {getColumns(row, classes)}
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Fade>
    );
  };

  return (
    <MBasicTableComponent
      tableBody={populateTableBody()}
      tableHeader={
        <MTableHeadersComponent tableHeaders={tableHeaders} classes={classes} />
      }
      tableName={tableName}
      tableId={tableId}
      height={height}
      stickyHeader={true}
    />
  );
};

export default OrderTable;
