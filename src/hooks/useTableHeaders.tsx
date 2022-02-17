interface ITableHeader {
  name: string;
  id: string;
}

const userRolesTable: Array<ITableHeader> = [
  {
    name: "Role Name",
    id: "roleName",
  },
  {
    name: "Permission",
    id: "permission",
  },
];

const registeredUsersTableHeader: Array<ITableHeader> = [
  {
    name: "User Information",
    id: "userAddress",
  },
  {
    name: "Email",
    id: "email",
  },
  // {
  //   name: "UserName",
  //   id: "userName",
  // },
  // {
  //   name: "Location",
  //   id: "userLocation",
  // },
  {
    name: "Role",
    id: "userRole",
  },
  // {
  //   name: "Status",
  //   id: "userStatus",
  // },
  {
    name: "Action",
    id: "action",
  },
];

const materialInfoTbl: ITableHeader[] = [
  {
    name: "Material Name",
    id: "producerName",
  },
  {
    name: "Description",
    id: "description",
  },
  {
    name: "Location",
    id: "location",
  },
  {
    name: "Qty",
    id: "quantity",
  },
];

const productBasicInfoTbl: ITableHeader[] = [
  {
    name: "Product",
    id: "productName",
  },
  {
    name: "QR-Code",
    id: "qrCode",
  },
  // {
  //   name: "Description",
  //   id: "description",
  // },
  // {
  //   name: "Location",
  //   id: "location",
  // },
  {
    name: "Qty",
    id: "quantity",
  },
  {
    name: "Price",
    id: "price",
  },
  {
    name: "Total",
    id: "total",
  },
];

const productInfoTbl: ITableHeader[] = [
  {
    name: "Product",
    id: "productName",
  },
  {
    name: "QR-Code",
    id: "qrCode",
  },
  // {
  //   name: "Description",
  //   id: "description",
  // },
  // {
  //   name: "Location",
  //   id: "location",
  // },
  {
    name: "Qty",
    id: "quantity",
  },
  {
    name: "Price",
    id: "price",
  },
  {
    name: "Total",
    id: "total",
  },
  {
    name: "Transporter",
    id: "transporter",
  },
  {
    name: "Store",
    id: "retailer",
  },
];
const productShipmentInfoTb: ITableHeader[] = [
  {
    name: "Distributor",
    id: "distributor",
  },
  {
    name: "Store",
    id: "retailer",
  },
];
const productDeliveredInfoTb: ITableHeader[] = [
  {
    name: "Logistic",
    id: "transporter",
  },
  {
    name: "Distributor",
    id: "distributor",
  },
];
const statusInfoTbl: ITableHeader[] = [
  {
    name: "Status",
    id: "packageStatus",
  },
  {
    name: "Action",
    id: "action",
  },
];

const registeredRawMaterialsTable: Array<ITableHeader> = [
  {
    name: "Manufacturer",
    id: "manufacturer",
  },
  {
    name: "Transporter",
    id: "shipper",
  },
];

const rawMaterialsReceivedTable: Array<ITableHeader> = [
  {
    name: "Supplier",
    id: "supplier",
  },
  {
    name: "Transporter",
    id: "shipper",
  },
];
const customerListTable: Array<ITableHeader> = [
  {
    name: "Buyer",
    id: "customerName",
  },
  {
    name: "Age",
    id: "customerAge",
  },
  {
    name: "Doctor",
    id: "doctorName",
  },
  {
    name: "Qty",
    id: "quantity",
  },
  {
    name: "Amount Paid",
    id: "amountPaid",
  },
  {
    name: "Updates",
    id: "viewUpdates",
  },
];

const userInfoTable: Array<ITableHeader> = [
  {
    name: "User Name",
    id: "userName",
  },
  {
    name: "Wallet Address",
    id: "userAddress",
  },
  {
    name: "Location",
    id: "userLocation",
  },
  // {
  //   name: "Status",
  //   id: "userStatus",
  // },
];

const batchInfoRawMaterialTable: Array<ITableHeader> = [
  {
    name: "Material Name",
    id: "producerName",
  },
  {
    name: "Location",
    id: "location",
  },
  {
    name: "Qty",
    id: "quantity",
  },
  {
    name: "Sender",
    id: "supplier",
  },
  {
    name: "Receiver",
    id: "manufacturer",
  },
  {
    name: "Transporter",
    id: "shipper",
  },
  {
    name: "Status",
    id: "packageStatus",
  },
];
const materialInspectionTable: Array<ITableHeader> = [
  {
    name: "Sender",
    id: "supplier",
  },
  {
    name: "Receiver",
    id: "manufacturer",
  },
];

const materialShipmentTable: Array<ITableHeader> = [
  {
    name: "Sender",
    id: "supplier",
  },
  {
    name: "Receiver",
    id: "manufacturer",
  },
];

const orderTable: Array<ITableHeader> = [
  {
    name: "Product",
    id: "product",
  },
  {
    name: "Quantity",
    id: "quantity",
  },
];

const getMaterialInfo = () => {
  return materialInfoTbl;
};

const getStatusInfo = () => {
  return statusInfoTbl;
};

const getProductInfo = () => {
  return productInfoTbl;
};
const getProductBasicInfo = () => {
  return productBasicInfoTbl;
};
const populateMaterialTblHeaders = (customHeaders) => {
  return [...getMaterialInfo(), ...customHeaders, ...getStatusInfo()];
};

const populateProductTblHeaders = (customHeaders) => {
  return [...getProductInfo(), ...customHeaders, ...getStatusInfo()];
};

const useTableHeaders = (tableName: string) => {
  let headers: ITableHeader[] = [];

  switch (tableName) {
    case "userRoles":
      headers = userRolesTable;
      break;
    case "registeredUsers":
      headers = registeredUsersTableHeader;
      break;
    case "registeredRawMaterials":
      headers = populateMaterialTblHeaders(registeredRawMaterialsTable);
      break;
    case "receivedRawMaterials":
      headers = populateMaterialTblHeaders(rawMaterialsReceivedTable);
      break;
    case "customers":
      headers = customerListTable;
      break;
    case "userInfo":
      headers = userInfoTable;
      break;
    case "batchInfoMaterial":
      headers = batchInfoRawMaterialTable;
      break;
    case "materialInspection":
      headers = populateMaterialTblHeaders(materialInspectionTable);
      break;
    case "materialShipment":
      headers = populateMaterialTblHeaders(materialShipmentTable);
      break;
    case "productShipment":
      headers = [
        ...getProductBasicInfo(),
        ...productShipmentInfoTb,
        ...getStatusInfo(),
        {
          name: "Agreement",
          id: "agreement",
        },
      ];
      break;
    case "regProductBatches":
      headers = [...getProductInfo(), ...getStatusInfo()];
      break;
    case "productsDelivered":
      headers = [
        ...getProductBasicInfo(),
        ...productDeliveredInfoTb,
        ...getStatusInfo(),
      ];
      break;
    case "RetailerOrderRequest":
      headers = [
        ...orderTable,
        {
          name: "Receiver",
          id: "manufacturer",
        },
        ...getStatusInfo(),
        {
          name: "Agreement",
          id: "contract",
        },
      ];
      break;
    case "DistributorOrderReview":
      headers = [
        ...orderTable,
        {
          name: "Requestor",
          id: "retailer",
        },
        ...getStatusInfo(),
        {
          name: "Agreement",
          id: "contract",
        },
      ];
      break;
    default:
      break;
  }
  return headers;
};

export default useTableHeaders;
