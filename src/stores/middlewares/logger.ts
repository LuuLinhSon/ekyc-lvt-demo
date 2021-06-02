import { isDevEnv } from 'config';
import { defaults, StoreState } from 'react-sweet-state';

const logger = (storeState: StoreState<any>) => (next: any) => (fn: any) => {
  // eslint-disable-next-line no-console
  console.groupCollapsed('Store', storeState.key);
  // keep comment code to check middleware with store
  // tslint:disable-next-line:no-console
  console.log('prev state:', JSON.parse(JSON.stringify(storeState.getState())));
  // tslint:disable-next-line:no-console
  console.log('payload:', fn);
  const result = next(fn);
  // tslint:disable-next-line:no-console
  console.log('next state:', JSON.parse(JSON.stringify(storeState.getState())));
  // eslint-disable-next-line no-console
  console.groupEnd();
  return result;
};

if (isDevEnv()) {
  defaults.middlewares.add(logger);
}
