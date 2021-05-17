import { Button } from '@material-ui/core';
import React from 'react';

const StepFour: React.FC<any> = (props) => {
  const finish = () => {};

  const backToStep = () => {
    props.goToStep(3);
    props.handleBack();
  };
  return (
    <div>
      <span>Step 4</span>
      <Button variant="contained" color="primary" onClick={finish}>
        Finish
      </Button>
      <Button variant="contained" color="primary" onClick={backToStep}>
        Back
      </Button>
    </div>
  );
};

export default StepFour;
