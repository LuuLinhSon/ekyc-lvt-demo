// import { Button } from '@material-ui/core';
import React from 'react';
// import CMND_CCCD from 'assets/images/cmnd.png';
import './StepFour.scss';
import { withRouter } from 'react-router-dom';
// import useStringee from 'custom-hook/useScript';
// import RoutesString from 'pages/routesString';
// import useStepperStore from 'stores/StepperStore/stepper';

const StepFour: React.FC<any> = (props) => {
  // const stringee = useStringee();

  console.log('stringee', window);
  
  // const history = useHistory();
  // // const location = useLocation();
  // const [, actionStepper] = useStepperStore();
  // const nextToStep = () => {
  //   history.push(RoutesString.StepTwoTwo);
  //   actionStepper.setCurrentPathStep(RoutesString.StepTwoTwo);
  // };

  // useEffect(() => {
  //   const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
  //   if (isCurrentPage) return;
  //   history.push(stateStepper.currentPathStep);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-center mb-5">Chúc mừng quý khách đã xác thực thành công</div>
    </div>
  );
};

export default withRouter(StepFour);
