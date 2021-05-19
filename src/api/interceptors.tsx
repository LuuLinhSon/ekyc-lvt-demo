import axios from 'axios';
// import axios, { AxiosError } from 'axios';
// import { defaultRegistry } from 'react-sweet-state';
// import get from 'lodash/get';

// import ApiConfig from 'config';
// import databases from 'cache';
// import { storeKey, Store } from 'stores/AuthenticationStore/authentication';
// import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
// import API from './index';
// import RoutesString from 'pages/routesString';
// import { API_ERROR_CODE } from 'constants/enum';

axios.interceptors.request.use(
  async (config) => {
    // ignore login request
    // if (config.url === ApiConfig.API.USER_SERVICE_LOGIN) {
    //   return config;
    // }
    // const authStore = await defaultRegistry.getStore(Store);
    // const { storeState } = authStore;

    // const authStates: AuthenticationStates = storeState.getState();
    // const accessToken = Object.keys(authStates.authenticate).length > 0 ? authStates.authenticate.accessToken : '';
    const newConfig = { ...config };
    // if (newConfig.headers && !newConfig.headers[`Authorization`]) {
    //   newConfig.headers[`Authorization`] = `Bearer ${accessToken}`;
    // }

    return newConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// export const handleRefreshToken = async (theRefreshToken: string, theAccessToken: string) => {
//   try {
//     const response = await API({
//       url: ApiConfig.API.USER_SERVICE_REFRESH_SESSION,
//       data: {
//         accessToken: theAccessToken,
//         refreshToken: theRefreshToken,
//       },
//       method: 'POST',
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// axios.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError) => {
//     if (`${error.response?.data.errorCode}` === API_ERROR_CODE.TOKEN_EXPIRED) {
//       try {
//         const authStore = await defaultRegistry.getStore(Store);
//         const { storeState, actions } = authStore;
//         const authStates: AuthenticationStates = storeState.getState();

//         const { authenticate } = authStates;
//         const refreshToken = get(authenticate, 'refreshToken', '');
//         const accessToken = get(authenticate, 'accessToken', '');

//         const response = await handleRefreshToken(refreshToken, accessToken);

//         actions.setAuthenticate({
//           authenticate,
//           ...response,
//         });

//         if (error.response) {
//           error.response.config.headers[`Authorization`] = `Bearer ${response.accessToken}`;

//           return axios(error.response.config);
//         }
//       } catch {
//         // TODO
//       }
//     }

//     // just redirect user to login page when his token is invalid
//     if (
//       `${error.response?.data.errorCode}` === API_ERROR_CODE.REFRESH_TOKEN_INVALID ||
//       `${error.response?.data.errorCode}` === API_ERROR_CODE.TOKEN_INVALID ||
//       `${error.response?.data.errorCode}` === API_ERROR_CODE.REFRESH_TOKEN_EXPIRED ||
//       `${error.response?.data.errorCode}` === API_ERROR_CODE.AUTH_TOKEN_INVALID
//     ) {
//       await databases.removeItem(storeKey);
//       window.location.href = RoutesString.Login;
//       return;
//     }

//     return Promise.reject(error);
//   },
// );
