import React from "react";
import withUserInfo from "../../hoc/withUserInfo";
import { IUserInfo } from "../../models/userInfo.interface";
import {
  getFilteredCustomerRecords,
} from "../../utils/helpers";
import MTypography from "../../generic/MTypography";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

type InfoProps = {
  classes: any;
  userInfo: IUserInfo;
  txRecords: any;
  customerRecords: any;
};

const CustomerCardComponent = ({
  classes,
  userInfo,
  txRecords,
  customerRecords,
}: InfoProps) => {
  const customers = getFilteredCustomerRecords(customerRecords);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", hide: true },
    { field: "customerName", headerName: "Name", sortable: false },
    { field: "quantity", headerName: "Qty", sortable: false },
    {
      field: "amountPaid",
      headerName: "Amt",
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `USD$ ${params.row.amountPaid}`,
    },
    {
      field: "timeStamp",
      headerName: "Purchased On",
      sortable: false,
      valueGetter: (params: GridValueGetterParams) => {
        const d = new Date(params.row.timeStamp);
        return d.toLocaleDateString();
      },
    },
  ];

  return (
    <div>
      <MTypography
        variant="h6"
        text="Customer Details"
        style={{ textAlign: "center", padding: 5 }}
      />
      {customers && (
        <div className="history-tl-container">
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={customers}
              columns={columns}
              disableSelectionOnClick
              hideFooterPagination
              density="standard"
              autoHeight
              hideFooter
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withUserInfo(CustomerCardComponent, "right", "customer");
