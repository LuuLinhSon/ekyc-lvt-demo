import { useState, useEffect } from 'react';
import { get } from 'lodash';
import axios from 'axios';

import API from './index';
import { useStoreAPI } from './storeAPI';
import { Params, useApiFunction } from './useAPI.d';
import { GET_METHOD } from 'api/api.constants';

/*
  custom hook for performing GET request
*/

const useAPI: useApiFunction = ({
  url,
  initialValue = [],
  params = {},
  method = GET_METHOD,
  payload = '',
  headers = {},
  loadInitialState = false,
}) => {
  const [data, setData] = useState(initialValue);
  const [currentInitialState, setCurrentInitialState] = useState(loadInitialState);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [currentMethod, setCurrentMethod] = useState(method);
  const [currentParams, setCurrentParams] = useState<Params | undefined>(params);
  const [currentPayLoad, setCurrentPayLoad] = useState(payload);
  const [loading, setLoading] = useState(true);
  const [state, actions] = useStoreAPI();

  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async function () {
      let newStore = {
        ...state,
        fetching: true,
        error: false,
        faults: '',
      };
      if (currentMethod === GET_METHOD) {
        newStore = {
          ...newStore,
          entityAction: '',
        };
      }
      try {
        actions.setStore(newStore);

        setLoading(true);

        const response = await API({
          url: currentUrl,
          params: currentParams,
          method: currentMethod,
          headers,
          data: currentPayLoad,
          cancelTokenSource,
        });

        if (isSubscribed) {
          setData(response);
          actions.setStore({
            ...state,
            fetching: false,
            error: false,
            data: response,
            faults: '',
          });
        }
      } catch (error) {
        const userMessage = get(error, 'response.data.userMessage', 'ERROR_MESSAGE_NO_NETWORK');

        // do not show toast error when cancel token
        if (
          ((Object.keys(error).length > 2 && userMessage !== 'ERROR_MESSAGE_NO_NETWORK') ||
            Object.keys(error).length === 1) &&
          isSubscribed
        ) {
          actions.setError(true);
          actions.setFaults(userMessage);
          actions.setFetching(false);
        }
      } finally {
        if (isSubscribed) {
          actions.setLoaded(true);
          setLoading(false);
        }
      }
    };
    if (currentInitialState) {
      fetchData();
    }
    return () => {
      actions.setStore({
        fetching: false,
      });
      cancelTokenSource && cancelTokenSource.cancel();
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, currentParams, currentUrl, currentMethod, currentPayLoad]);
  return {
    loading,
    data,
    state,
    actions,
    currentMethod,
    setCurrentUrl,
    setCurrentParams,
    setCurrentInitialState,
    setCurrentMethod,
    setCurrentPayLoad,
  };
};

export default useAPI;
