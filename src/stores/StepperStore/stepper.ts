import RoutesString from 'pages/routesString';
import { createStore, createHook, StoreActionApi, createContainer } from 'react-sweet-state';

export const SEPPER_STORE = 'StoreStepper';

interface StoreStepper {
  initiated: boolean;
  activeStep: number;
  currentPathStep: string;
}

type StoreStep = StoreActionApi<StoreStepper>;
type Action = typeof actions;

export const initialState: StoreStepper = {
  initiated: false,
  activeStep: 0,
  currentPathStep: RoutesString.StepOne,
};

export const actions = {
  setActiveStep:
    (step: number) =>
    ({ setState, getState }: StoreStep) => {
      const preState = getState();
      setState({ ...preState, activeStep: step });
    },
  nextStep:
    () =>
    ({ setState, getState }: StoreStep) => {
      const preState = getState();
      setState({ ...preState, activeStep: preState.activeStep + 1 });
    },
  backStep:
    () =>
    ({ setState, getState }: StoreStep) => {
      const preState = getState();
      setState({ ...preState, activeStep: preState.activeStep - 1 });
    },
  setCurrentPathStep:
    (path: string) =>
    ({ setState, getState }: StoreStep) => {
      const preState = getState();
      setState({ ...preState, currentPathStep: path });
    },
  resetStepper:
    () =>
    ({ setState }: StoreStep) => {
      setState({
        initiated: false,
        activeStep: 0,
        currentPathStep: RoutesString.StepOne,
      });
    },
};

export const Store = createStore<StoreStepper, Action>({
  initialState,
  actions,
  name: SEPPER_STORE,
});

const useStepperStore = createHook(Store);

export const storeKeyStepper = `${Store.key.join('__')}@__global__`;

type StepperContainerProps = {
  initialState: StoreStepper;
};
export const StepperContainer = createContainer<StoreStepper, Action, StepperContainerProps>(Store, {
  onInit:
    () =>
    ({ setState }: StoreStep, { initialState }) => {
      setState({ ...initialState });
    },
});

export default useStepperStore;
