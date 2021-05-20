import React from 'react';
import LVT_LOGO from 'assets/images/lvt-img.png';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import useStepperStore from 'stores/StepperStore/stepper';
import { Button } from '@material-ui/core';

import './LoggedInLayout.scss';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import RoutesString from 'pages/routesString';
import { useHistory } from 'react-router-dom';

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

const LoggedLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const [stateStepper, actionStepper] = useStepperStore();
  const history = useHistory();

  const [, actionAuth] = useAuthentication();
  const steps = getSteps();

  const logout = async () => {
    await actionAuth.logout();
    await actionStepper.resetStepper();
    history.push(RoutesString.StepOne, {});
  };

  return (
    <div className="full-screen">
      <div className="login-layout">
        <Button className="next-button" variant="contained" color="primary" onClick={logout}>
          Đăng xuất
        </Button>
      </div>
      <div className="logged-in-layout">
        <div className="logged-in-layout-content">
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
        </div>
      </div>
    </div>
  );
};

export default LoggedLayout;
