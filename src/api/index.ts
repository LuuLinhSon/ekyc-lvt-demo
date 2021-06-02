import axios from 'axios';
import { stringify, parse } from 'query-string';
import get from 'lodash/get';

import { APIFunction, ErrorObjectType } from './api.d';
// import './interceptors';

export const API_ERROR_MESSAGE_GENERAL = 'Oops. Something wrong happened';
export const ERROR_MESSAGE_NO_NETWORK = 'ERROR_MESSAGE_NO_NETWORK';

let isOnline: boolean = navigator.onLine;

window.addEventListener('offline', () => {
  isOnline = false;
});

window.addEventListener('online', () => {
  isOnline = true;
});

const api: APIFunction = async ({
  url,
  params = '',
  method = 'get',
  headers = {},
  data = '',
  cancelTokenSource,
  onUploadProgress,
}) => {
  const newParams = parse(stringify(params as object, { arrayFormat: 'comma' }));

  try {
    const response = await axios({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        ...headers,
      },
      params: newParams,
      data,
      cancelToken: cancelTokenSource?.token,
      onUploadProgress,
    });
    return response && response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;

    const userMessage =
      get(error, 'response.data.userMessage', '') ||
      get(error, 'response.data.message', '') ||
      get(error, 'response.data.error', '') ||
      'ERROR_MESSAGE_NO_NETWORK';

    const errors = get(error, 'response.data.errors', null);
    let extraErrorMessage = '';
    if (errors) {
      extraErrorMessage = errors
        .map((err: ErrorObjectType) => {
          return err && err.message;
        })
        .join('<br /> ');
      extraErrorMessage = `<br />${extraErrorMessage}`;
    }

    const response = get(error, 'response', {});
    const dataResponse = get(error, 'response.data', {});

    if (isOnline) {
      const errObject = {
        ...error,
        response: {
          ...response,
          data: {
            ...dataResponse,
            userMessage: `${userMessage}${extraErrorMessage}`,
          },
        },
      };

      throw errObject;
    } else {
      const offlineResponse = {
        response: {
          data: {
            userMessage: 'ERROR_MESSAGE_NO_NETWORK',
          },
        },
      };

      throw offlineResponse;
    }
  } finally {
    // dome something else
  }
};

export default api;
