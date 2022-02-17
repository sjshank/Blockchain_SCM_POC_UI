import React from "react";
import UserListComponent from "../../generic/UserList";
import { ROLE_BRAND } from "../../utils/constants";

type PharmaListProps = {
  list: Array<any>;
};

const PharmaListComponent = ({ list }: PharmaListProps) => {
  return (
    <UserListComponent
      users={list}
      label="Stores Associated"
      tableName="Retailers Table"
      tableId="retailerListTbl"
      color={ROLE_BRAND["retailer"]["bgColor"]}
    />
  );
};

export default PharmaListComponent;
