import React from 'react';
import LVT_LOGO from 'assets/images/lvt-img.png';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import './AnonymousUserLayout.scss';
import useStepperStore from 'stores/StepperStore/stepper';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router';
import RoutesString from 'pages/routesString';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const getSteps = () => {
  return ['', '', '', ''];
};

const AnonymousUserLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const [stateStepper] = useStepperStore();
  const steps = getSteps();
  const history = useHistory();

  const toOrcFace = () => {
    history.push(RoutesString.OrcFace);
  }

  return (
    <div className="full-screen anonymous-layout">
      <div className="anonymous-layout-content">
        <>
          <div className="wrapper-button">
          <Button className="action-button" variant="contained" color="primary" onClick={toOrcFace}>
            OCR FACE
          </Button>
          </div>
          <div className="mt-5 mb-5">
            <div className="mb-4 d-flex justify-content-center">
              <img src={LVT_LOGO} className="d-block" alt="LOGO_ALT" height="50" />
            </div>
            <div className={classes.root}>
              <Stepper activeStep={stateStepper.activeStep}>
                {steps.map((label, index) => {
                  const stepProps: any = {};
                  const labelProps: any = {};
                  return (
                    <Step key={index} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <div>{children}</div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default AnonymousUserLayout;
