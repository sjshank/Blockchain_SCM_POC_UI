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
import MTableCellComponent from "../../generic/MTableCell";
import { IUserInfo, IUserInfoContext } from "../../models/userInfo.interface";
import { UserInfoContext } from "../../context/UserContext";
import { IProduct } from "../../models/product.interface";
import NumberFormat from "react-number-format";
import ProductTitleComponent from "../../components/ProductTitle";
import ProductQRCodeComponent from "../../components/ProductQRCode";
import { getProductURL } from "../../utils/helpers";
import _ from "lodash";

type ProductTableProps = {
  dataList: IProduct[];
  userList: IUserInfo[];
  tableHeaderIdentifier: string;
  tableName: string;
  tableId: string;
  height?: string;
  showManufacturerCol?: boolean;
  showShipperCol?: boolean;
  showDistributorCol?: boolean;
  showRetailCol?: boolean;
  getColumns: any;
  handleQRCodeEvent?: any;
  dialogStatus?: any;
  closeDialog?: any;
};

const ProductTable = ({
  dataList,
  userList,
  getColumns,
  tableHeaderIdentifier,
  tableName,
  tableId,
  height,
  showManufacturerCol = false,
  showShipperCol = false,
  showDistributorCol = false,
  showRetailCol = false,
  handleQRCodeEvent,
  dialogStatus,
  closeDialog,
}: ProductTableProps) => {
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
        whiteSpace: "nowrap",
        verticalAlign: "middle",
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
          {dataList.map((row: IProduct) => (
            <Fade
              in={true}
              timeout={500}
              key={
                row.productBasicInfo.productId +
                row.productBasicInfo.productName
              }
            >
              <TableRow key={row.productBasicInfo.productId}>
                <TableCell
                  align="left"
                  className={classes.tableBodyCell}
                  style={{ maxWidth: 300, whiteSpace: "inherit" }}
                >
                  <ProductTitleComponent
                    productData={row}
                    handleQRCodeEvent={handleQRCodeEvent}
                    dialogStatus={dialogStatus}
                    closeDialog={closeDialog}
                  />
                </TableCell>
                <TableCell align="left" style={{ width: 40 }}>
                  <ProductQRCodeComponent
                    data={getProductURL(row.productBasicInfo.productId)}
                    mouseOverEvent={() =>
                      handleQRCodeEvent(row.productBasicInfo)
                    }
                    dialogTitle={dialogStatus.dialogTitle}
                    dialogId={dialogStatus.dialogId}
                    uui={row.productBasicInfo.productId}
                    isOpen={dialogStatus.openFormDialog}
                    closeDialog={closeDialog}
                  />
                </TableCell>
                {/* <MTableCellComponent
                  classname={classes.tableBodyCell}
                  text={row.productBasicInfo.productDesc}
                />
                <MTableCellComponent
                  classname={classes.tableBodyCell}
                  text={row.productBasicInfo.warehouseLoc}
                /> */}
                <MTableCellComponent
                  classname={classes.tableBodyCell}
                  text={row.productBasicInfo.quantity}
                />
                <MTableCellComponent
                  classname={classes.tableBodyCell}
                  text={
                    <NumberFormat
                      value={row.productBasicInfo.price}
                      displayType={"text"}
                      prefix={"$"}
                      thousandSeparator={true}
                      decimalSeparator="."
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  }
                />
                <MTableCellComponent
                  classname={classes.tableBodyCell}
                  text={
                    <NumberFormat
                      value={row.productBasicInfo.totalPrice}
                      displayType={"text"}
                      prefix={"$"}
                      thousandSeparator={true}
                      decimalSeparator="."
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  }
                />
                {showShipperCol && (
                  <TableCell align="left" className={classes.tableBodyCell}>
                    <UserBadgeComponent
                      title={row.productAdvanceInfo?.transporter}
                      users={userList}
                      role="4"
                    />
                  </TableCell>
                )}
                {showDistributorCol && (
                  <TableCell align="left" className={classes.tableBodyCell}>
                    <UserBadgeComponent
                      title={row.productAdvanceInfo?.distributor}
                      users={userList}
                      role="2"
                    />
                  </TableCell>
                )}
                {showRetailCol && (
                  <TableCell align="left" className={classes.tableBodyCell}>
                    <UserBadgeComponent
                      title={row.productAdvanceInfo?.retailer}
                      users={userList}
                      role="3"
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

export default ProductTable;
