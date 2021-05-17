import { FC, ComponentType, useState, useLayoutEffect } from 'react';

import databases from 'cache';
import { APIContainer, storeKey, initialState as initialStoreState } from './storeAPI';

const withStoreAPIPersist = <P extends object>(Component: ComponentType<P>): FC<P> => ({ ...props }: any) => {
  const [storePersisted, setStorePersisted] = useState(initialStoreState);

  useLayoutEffect(() => {
    (async function getPersistData() {
      const data = await databases.getItem(storeKey).catch((err: Error) => {
        // tslint:disable-next-line:no-console
        console.error(err);
      });
      if (data) {
        setStorePersisted({
          ...data,
          initiated: true,
        });
      } else {
        setStorePersisted({
          ...initialStoreState,
          initiated: true,
        });
      }
    })();
  }, []);

  if (storePersisted && !storePersisted.initiated) return null;
  return (
    <APIContainer isGlobal={true} initialState={storePersisted}>
      <Component {...(props as P)} />
    </APIContainer>
  );
};

export default withStoreAPIPersist;
