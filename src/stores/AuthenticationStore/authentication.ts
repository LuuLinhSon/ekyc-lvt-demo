import { createStore, createHook, StoreActionApi, createContainer } from 'react-sweet-state';
import { AuthenticationStates, OcrInformation } from './authenticationType';
import { sha256 } from 'js-sha256';

import API from 'api';
import { SESSION_TIMEOUT } from 'config';
import databases from 'cache';
// import publicIp from 'public-ip';
import { get } from 'lodash';
import { storeKeyStepper } from 'stores/StepperStore/stepper';
import { notify } from 'components/toast/Toast';

export const AUTHENTICATION_STORE = 'StoreAuthentication';
type StoreApi = StoreActionApi<AuthenticationStates>;
type Actions = typeof actions;

const YYYYMMDDHHMMSS = () => {
  const date = new Date();
  const yyyy = date.getFullYear().toString();
  const MM = pad(date.getMonth() + 1, 2);
  const dd = pad(date.getDate(), 2);
  const hh = pad(date.getHours(), 2);
  const mm = pad(date.getMinutes(), 2);
  const ss = pad(date.getSeconds(), 2);
  const ms = pad(date.getMilliseconds(), 3);

  return `${yyyy}${MM}${dd}${hh}${mm}${ss}.${ms}`;
};

const getDate = () => {
  return YYYYMMDDHHMMSS();
};

const pad = (num: any, length: any) => {
  let str = `${num}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
};

export const requestLogin = async (phone: string, password: string) => {
  const timestamp = new Date().getTime();
  const clientTime = getDate();
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const response = await API({
    url: 'https://ekycsandbox.lienviettech.vn/lv24/rest/web/request',
    method: 'POST',
    headers,
    data: {
      clientHeader: {
        language: 'VN',
        clientRequestId: `${timestamp}`,
        deviceId: 'WEB_TEST',
        clientAddress: '192.168.201.140',
        platform: 'LOCAL',
        function: 'secureLogin',
      },
      body: {
        header: {
          clientRequestId: `${timestamp}`,
          clientTime,
          zonedClientTime: `${timestamp}`,
          channelCode: 'WEBVIVIET',
          userName: phone,
          deviceId: 'WEB_TEST',
          authorizedMode: 0,
          checkerMode: 0,
          ip: '192.168.201.140',
          language: 'VN',
          platform: 'LOCAL',
          makerId: 'SONLL',
          appVersion: '1.0.0',
        },
        userPwd: sha256(password),
      },
    },
  });
  return response;
};

export const getListArea = async (sessionId: string, userId: string) => {
  const timestamp = new Date().getTime();
  const clientTime = getDate();
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const listAreaResponse = await API({
    url: 'https://ekycsandbox.lienviettech.vn/lv24/rest/web/request',
    method: 'POST',
    headers,
    data: {
      clientHeader: {
        language: 'VN',
        clientRequestId: `${timestamp}`,
        deviceId: 'TESTDEMO',
        clientAddress: '192.168.201.140',
        platform: 'LOCAL',
        function: 'getListArea',
      },
      body: {
        header: {
          platform: 'LOCAL',
          clientRequestId: `${timestamp}`,
          clientTime,
          zonedClientTime: `${timestamp}`,
          channelCode: 'WEBVIVIET',
          deviceId: 'TESTDEMO',
          sessionId,
          userId,
          authorizedMode: 0,
          checkerMode: 0,
          ip: '192.168.201.140',
          makerId: 'SONLL',
          language: 'VN',
        },
      },
    },
  });

  return listAreaResponse;
};

export const actions = {
  setNumberVerify:
    (numberVerify: string) =>
    ({ setState, getState }: StoreApi) => {
      const prevState = getState();
      setState({ ...prevState, numberVerify });
    },
  setOcrInformation:
    (ocrInformation: OcrInformation) =>
    ({ setState, getState }: StoreApi) => {
      const prevState = getState();
      setState({ ...prevState, ocrInformation });
    },
  setEkycId:
    (ekycId: string) =>
    ({ setState, getState }: StoreApi) => {
      const prevState = getState();
      setState({ ...prevState, ekycId });
    },
  setActionError:
    (actionError: string | null) =>
    ({ setState, getState }: StoreApi) => {
      const prevState = getState();
      setState({ ...prevState, actionError });
    },
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
    (values: any, actionStoreAPI: any) =>
    async ({ setState, getState }: StoreApi) => {
      const prevState = getState();
      try {
        actionStoreAPI.setFetching(true);
        const response = await requestLogin(values.phone, values.password);
        const resultCode = get(response, 'body.resultCode', '');
        const resultDesc = get(response, 'body.resultDesc', '');
        const userId = get(response, 'body.session.userId', '');
        const sessionId = get(response, 'body.session.sessionId', '');
        const responseArea = await getListArea(sessionId, userId);
        const listArea = get(responseArea, 'body.area', []);

        if (resultCode === '0') {
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
            listArea,
            loggedIn: true,
          });

          notify.success('Đăng nhập thành công');
          return;
        }

        setState({
          ...prevState,
          loggedIn: false,
        });

        notify.error(resultDesc);
      } catch (e) {
        setState({
          ...prevState,
          loggedIn: false,
        });
        notify.error('Đã xảy ra lỗi vui lòng thử lại');
      } finally {
        actionStoreAPI.setFetching(false);
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
  ocrInformation: {
    name: '',
    id: '',
    address: '',
    brithDay: '',
    province: '',
    people: '',
    expireDate: '',
    issueDate: '',
    sex: '',
    sign: '',
    time: '',
    cardType: '',
    provinceCode: '',
    districtCode: '',
    precinctCode: '',
    provinceDetail: {
      city: '',
      district: '',
      precinct: '',
      streetName: '',
    },
    nameConfidence: false,
    idConfidence: false,
    brithDayConfidence: false,
    provinceConfidence: false,
    addressConfidence: false,
    peopleConfidence: false,
    expireDateConfidence: false,
    issueDateConfidence: false,
    sexConfidence: false,
    signConfidence: false,
    timeConfidence: false,
  },
  listArea: [],
  ekycId: null,
  actionError: null,
  numberVerify: null,
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
