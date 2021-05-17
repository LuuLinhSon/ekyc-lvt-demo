import { createStore, createHook, StoreActionApi } from 'react-sweet-state';

export const SEPPER_STORE = 'StoreStepper';

interface StoreStepper {
  activeStep: number;
}

type StorePage = StoreActionApi<StoreStepper>;
type Action = typeof actions;

export const initialState: StoreStepper = {
  activeStep: 0,
};

export const actions = {
  setActiveStep:
    (step: number) =>
    ({ setState }: StorePage) => {
      setState({ activeStep: step });
    },
  nextStep:
    () =>
    ({ setState, getState }: StorePage) => {
      const preState = getState();
      setState({ activeStep: preState.activeStep + 1 });
    },
  backStep:
    () =>
    ({ setState, getState }: StorePage) => {
      const preState = getState();
      setState({ activeStep: preState.activeStep - 1 });
    },
};

export const store = createStore<StoreStepper, Action>({
  initialState,
  actions,
  name: SEPPER_STORE,
});

const useStepperStore = createHook(store);

export default useStepperStore;
