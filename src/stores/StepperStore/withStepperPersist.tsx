import { FC, ComponentType, useState, useLayoutEffect } from 'react';

import databases from '../../cache';
import { StepperContainer, storeKeyStepper, initialState as initialStoreState } from './stepper';

const withStepperPersist =
  <P extends object>(Component: ComponentType<P>): FC<P> =>
  ({ ...props }: any) => {
    const [storePersisted, setStorePersisted] = useState(initialStoreState);

    useLayoutEffect(() => {
      (async function getPersistData() {
        const data = await databases.getItem(storeKeyStepper).catch((err: Error) => {
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
      <StepperContainer isGlobal={true} initialState={storePersisted}>
        <Component {...(props as P)} />
      </StepperContainer>
    );
  };

export default withStepperPersist;
