import { STORE_NAME } from 'api/storeAPI';
import { defaults, StoreState } from 'react-sweet-state';
import { AUTHENTICATION_STORE } from 'stores/AuthenticationStore/authentication';
import { SEPPER_STORE } from 'stores/StepperStore/stepper';

import database from '../../cache';

const WHITE_LIST = [STORE_NAME, AUTHENTICATION_STORE, SEPPER_STORE];

const persistent = (storeState: StoreState<any>) => (next: any) => (fn: any) => {
  const result = next(fn);
  const { key } = storeState;
  const isWhiteList: string[] = WHITE_LIST.filter((store) => key.includes(store));
  if (isWhiteList.length > 0) {
    const state = storeState.getState();
    database.setItem(storeState.key, state).catch((err: Error) => {
      // tslint:disable-next-line:no-console
      console.error(err);
    });
  }

  return result;
};

defaults.middlewares.add(persistent);
