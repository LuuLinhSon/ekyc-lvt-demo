import { createStore, createHook, StoreActionApi, createContainer } from 'react-sweet-state';
import { AuthenticationStates } from './authenticationType';
import API from 'api';
import ApiConfig, { SESSION_TIMEOUT } from 'config';

export const AUTHENTICATION_STORE = 'StoreAuthentication';
type StoreApi = StoreActionApi<AuthenticationStates>;
type Actions = typeof actions;

export const requestLogin = async (token: string, email: string) => {
  const headers = {
    email,
  };
  const response = await API({
    url: ApiConfig.API.USER_SERVICE_LOGIN,
    method: 'POST',
    headers,
    data: {
      token,
    },
  });
  return response;
};

export const actions = {
  onLoad: (payload: AuthenticationStates) => ({ setState }: StoreApi) => {
    setState({ ...payload });
  },
  logout: () => async ({ setState }: StoreApi) => {},
  login: (values: any) => async ({ setState, getState }: StoreApi) => {},
  setAuthenticate: (auth: any) => ({ setState, getState }: StoreApi) => {
    const prevState = getState();
    setState({
      ...prevState,
      authenticate: auth,
    });
  },
};

export const initialState: AuthenticationStates = {
  mediaAuthentication: {
    token: '',
    startTime: 0,
  },
  user: {
    id: '',
    firstName: null,
    lastName: null,
    email: '',
    token: '',
    externalToken: '',
    sessionId: '',
    externalSessionId: '',
    externalUserId: '',
    permissions: [],
  },
  message: '',
  loggedIn: false,
  failedTimes: 0,
  initiated: false,
  authenticate: {
    accessToken: '',
    refreshToken: '',
    menuItems: [],
  },
  captchaToken: '',
  timeout: SESSION_TIMEOUT,
};
export const Store = createStore<AuthenticationStates, Actions>({
  initialState,
  actions,
  name: AUTHENTICATION_STORE,
});

const useAuthentication = createHook(Store);

export const storeKey = `${Store.key.join('__')}@__global__`;

type StoreContainerProps = {
  initialState: AuthenticationStates;
};
export const AuthenticationContainer = createContainer<AuthenticationStates, Actions, StoreContainerProps>(Store, {
  onInit: () => ({ setState }: StoreApi, { initialState }) => {
    setState({ ...initialState });
  },
});

export default useAuthentication;
