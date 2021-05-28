import React, { useEffect } from 'react';
import StepOneForm from './StepOne';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import { useHistory } from 'react-router-dom';
import RoutesString from 'pages/routesString';
import useStepperStore from 'stores/StepperStore/stepper';
import { useStoreAPI } from 'api/storeAPI';

const StepOneContainer: React.FC<any> = (props) => {
  const history = useHistory();
  const [, actionStepper] = useStepperStore();
  const [state, actions] = useAuthentication();
  const [, actionStoreAPI] = useStoreAPI();

  useEffect(() => {
    if (state.loggedIn) {
      history.push(RoutesString.StepTwo);
      actionStepper.setCurrentPathStep(RoutesString.StepTwo);
      actionStepper.setActiveStep(1);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loggedIn, history]);

  const handleSubmit = async (values: any) => {
    await actions.login(values, actionStoreAPI);
  };

  return <StepOneForm handleSubmit={handleSubmit} />;
};

export default StepOneContainer;
