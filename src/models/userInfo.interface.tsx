export interface IUserInfo {
  userName: string | any | null;
  userRole: number | string;
  userAddress: string | any | null;
  userLocation: string;
  userRoleName: string;
  userStatus?: string;
  isDeleted: boolean;
  registrationDate: number | any;
  fullName?: string | any;
  phone?: number | string | any;
  email?: string | any;
}

export interface IUserInfoAction {
  setUserInfo?: any;
  logout?: any;
}

export interface IUserInfoContext {
  userInfo: IUserInfo;
  userInfoAction: IUserInfoAction;
}

export interface IUserRole {
  roleName: string;
  bgColor: string;
  permission: string;
  color: string;
}
