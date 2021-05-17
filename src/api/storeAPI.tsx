import { createStore, createHook, createContainer } from 'react-sweet-state';
import { StoreApi, IStoreAPIState, APIActions } from './storeAPI.d';

export const STORE_NAME = 'StoreAPI';

export const initialState: IStoreAPIState = {
  loaded: true,
  fetching: false,
  error: false,
  data: null,
  faults: '',
  initiated: false,
  params: null,
  method: '',
  url: '',
  entityAction: '',
};

// All the actions that mutate the store
export const actions = {
  initData: (payload: IStoreAPIState) => ({ setState }: StoreApi) => {
    setState({
      ...payload,
    });
  },
  setStore: (apiState: IStoreAPIState) => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      ...apiState,
    });
  },
  setData: (data: any = null) => ({ setState, getState }: StoreApi) => {
    const { data: prevData } = getState();
    setState({
      ...prevData,
      data,
    });
  },

  setFetching: (payload: boolean = false) => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      fetching: payload,
    });
  },
  setParams: (params: any = null) => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      params,
    });
  },
  setMethod: (method: string = '') => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      method,
    });
  },
  setURL: (url: string = '') => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      url,
    });
  },
  setError: (payload: boolean = false) => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      error: payload,
    });
  },

  setFaults: (payload: string = '') => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      faults: payload,
    });
  },

  setLoaded: (payload: boolean = false) => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      loaded: payload,
    });
  },

  setResetErrorMessage: () => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      faults: '',
    });
  },
  setEntityAction: (entityAction: string) => ({ setState, getState }: StoreApi) => {
    const prevData = getState();
    setState({
      ...prevData,
      entityAction,
    });
  },
};

export const Store = createStore({ initialState, actions, name: STORE_NAME });

export const useStoreAPI = createHook(Store);
type StoreContainerProps = {
  initialState: IStoreAPIState;
};
export const APIContainer = createContainer<IStoreAPIState, APIActions, StoreContainerProps>(Store, {
  onInit: () => ({ setState }: StoreApi, { initialState: init }) => {
    setState({ ...init });
  },
});
// populate store from cache
export const storeKey = `${Store.key.join('__')}@__global__`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  useStoreAPI,
};
