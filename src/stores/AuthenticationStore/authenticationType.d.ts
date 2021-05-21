interface UserInformationState {
  userId: string;
  approveStatus: string;
  custId: string;
  custNo: string;
  fullName: string;
  needChangePass: string;
  primaryEmail: string;
  primaryPhone: string;
  primaryUser: string;
  userName: string;
  userStatus: string;
  userType: string;
  userAvatar: string;
}

interface ClientHeaderState {
  language: string;
  clientRequestId: string;
  platform: string;
  service: string;
  function: string;
}

interface CustomerState {
  cifNo: string;
  customerId: string;
  customerNo: string;
}

interface SessionState {
  userId: string;
  userName: string;
  sessionId: string;
}

interface OcrInformation {
  name: string;
  id: string;
  brithDay: string;
  province: string;
  address: string;
  people: string;
  expireDate: string;
  issueDate: string;
  sex: string;
  sign: string;
  time: string;
  cardType: string;
  provinceDetail: {
    city: string;
    district: string;
    precinct: string;
    street: string;
  };
  nameConfidence: boolean;
  idConfidence: boolean;
  brithDayConfidence: boolean;
  provinceConfidence: boolean;
  addressConfidence: boolean;
  peopleConfidence: boolean;
  expireDateConfidence: boolean;
  issueDateConfidence: boolean;
  sexConfidence: boolean;
  signConfidence: boolean;
  timeConfidence: boolean;
}

interface AuthenticationStates {
  clientHeader: ClientHeaderState;
  user: UserInformationState;
  customer: CustomerState;
  session: SessionState;
  ocrInformation: OcrInformation;
  ekycId: string | null;
  actionError: string | null;
  numberVerify: string | null;
  loggedIn: boolean;
  initiated?: boolean;
  timeout: number;
}

export { AuthenticationStates, UserInformationState, ClientHeaderState, CustomerState, SessionState, OcrInformation };
