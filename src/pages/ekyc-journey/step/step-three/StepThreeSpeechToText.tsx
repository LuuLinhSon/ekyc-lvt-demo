import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useStepperStore from 'stores/StepperStore/stepper';

const StepThreeSpeechToText: React.FC<any> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [stateStepper] = useStepperStore();

  useEffect(() => {
    const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
    if (isCurrentPage) return;
    history.push(stateStepper.currentPathStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <span>Step StepThreeSpeechToText</span>
    </div>
  );
};

export default StepThreeSpeechToText;
