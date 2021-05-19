import { createStore, createHook, StoreActionApi, createContainer } from 'react-sweet-state';
import { AuthenticationStates } from './authenticationType';
import { sha256 } from 'js-sha256';

import API from 'api';
import { SESSION_TIMEOUT } from 'config';
import databases from 'cache';
import publicIp from 'public-ip';
import { get } from 'lodash';
import { storeKeyStepper } from 'stores/StepperStore/stepper';

export const AUTHENTICATION_STORE = 'StoreAuthentication';
type StoreApi = StoreActionApi<AuthenticationStates>;
type Actions = typeof actions;

export const requestLogin = async (phone: string, password: string) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const response = await API({
    url: 'https://stbsandbox.viviet.vn/transaction-service/rest/web/request',
    method: 'POST',
    headers,
    data: {
      clientHeader: {
        language: 'VN',
        clientRequestId: '1559014103614',
        deviceId: 'TESTDEMO',
        clientAddress: await publicIp.v4(),
        platform: 'LOCAL',
        function: 'secureLogin',
      },
      body: {
        header: {
          clientRequestId: '1559014103614',
          clientTime: '20190925093222.939',
          // zonedClientTime: '{{zonedClientTime}}',
          channelCode: 'EPAYMENT',
          userName: phone,
          deviceId: 'WEB_TEST',
          authorizedMode: 0,
          checkerMode: 0,
          ip: await publicIp.v4(),
          language: 'VN',
          platform: 'android',
          makerId: 'HUYPQ',
          appVersion: '1.0.0',
        },
        userPwd: sha256(password),
      },
    },
  });
  return response;
};

export const actions = {
  onLoad:
    (payload: AuthenticationStates) =>
    ({ setState }: StoreApi) => {
      setState({ ...payload });
    },
  logout:
    () =>
    async ({ setState }: StoreApi) => {
      setState({ ...initialState });
      if (databases) {
        await databases.removeItem(storeKey);
        await databases.removeItem(storeKeyStepper);
      }
    },
  login:
    (values: any, alert: any) =>
    async ({ setState, getState }: StoreApi) => {
      const prevState = getState();
      try {
        const response = await requestLogin(values.phone, values.password);
        const resultDesc = get(response, 'body.resultDesc', '');
        if (resultDesc === 'success') {
          setState({
            ...prevState,
            clientHeader: get(response, 'clientHeader', {}),
            user: {
              userId: get(response, 'body.user.userId', ''),
              approveStatus: get(response, 'body.user.approveStatus', ''),
              custId: get(response, 'body.user.custId', ''),
              custNo: get(response, 'body.user.custNo', ''),
              fullName: get(response, 'body.user.fullName', ''),
              needChangePass: get(response, 'body.user.needChangePass', ''),
              primaryEmail: get(response, 'body.user.primaryEmail', ''),
              primaryPhone: get(response, 'body.user.primaryPhone', ''),
              primaryUser: get(response, 'body.user.primaryUser', ''),
              userName: get(response, 'body.user.userName', ''),
              userStatus: get(response, 'body.user.userStatus', ''),
              userType: get(response, 'body.user.userType', ''),
              userAvatar: get(response, 'body.user.userAvatar', ''),
            },
            customer: {
              cifNo: get(response, 'body.customer.cifNo', ''),
              customerId: get(response, 'body.customer.customerId', ''),
              customerNo: get(response, 'body.customer.customerNo', ''),
            },
            session: {
              userId: get(response, 'body.session.userId', ''),
              userName: get(response, 'body.session.userName', ''),
              sessionId: get(response, 'body.session.sessionId', ''),
            },
            loggedIn: true,
          });

          alert.success('Đăng nhập thành công');
          return;
        }

        setState({
          ...prevState,
          loggedIn: false,
        });

        return alert.error('Thông tin đăng nhập không đúng');
      } catch (e) {
        setState({
          ...prevState,
          loggedIn: false,
        });
      }
    },
};

export const initialState: AuthenticationStates = {
  clientHeader: {
    language: '',
    clientRequestId: '',
    platform: '',
    service: '',
    function: '',
  },
  user: {
    userId: '',
    approveStatus: '',
    custId: '',
    custNo: '',
    fullName: '',
    needChangePass: '',
    primaryEmail: '',
    primaryPhone: '',
    primaryUser: '',
    userName: '',
    userStatus: '',
    userType: '',
    userAvatar: '',
  },
  customer: {
    cifNo: '',
    customerId: '',
    customerNo: '',
  },
  session: {
    userId: '',
    userName: '',
    sessionId: '',
  },
  loggedIn: false,
  initiated: false,
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
  onInit:
    () =>
    ({ setState }: StoreApi, { initialState }) => {
      setState({ ...initialState });
    },
});

export default useAuthentication;
