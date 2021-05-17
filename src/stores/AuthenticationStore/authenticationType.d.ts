interface UserInformation {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  token: string;
  externalToken?: string;
  sessionId?: string;
  externalSessionId?: string;
  externalUserId?: string;
  permissions: string[];
}

interface AuthenticationStates {
  message: string;
  user: UserInformation;
  loggedIn: boolean;
  failedTimes: number;
  initiated?: boolean;
  authenticate: AuthenticateInformation;
  captchaToken: string | null;
  timeout: number;
  mediaAuthentication: MediaAuthentication;
}

interface MediaAuthentication {
  token: string;
  startTime: number;
}

interface AuthenticateInformation {
  accessToken: string;
  refreshToken: string;
  menuItems: string[];
}

interface TokenData {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
}

export { AuthenticationStates, UserInformation, AuthenticateInformation, TokenData, MediaAuthentication };
