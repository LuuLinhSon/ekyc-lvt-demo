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

interface AuthenticationStates {
  clientHeader: ClientHeaderState;
  user: UserInformationState;
  customer: CustomerState;
  session: SessionState;
  loggedIn: boolean;
  initiated?: boolean;
  timeout: number;
}

export { AuthenticationStates, UserInformationState, ClientHeaderState, CustomerState, SessionState };
