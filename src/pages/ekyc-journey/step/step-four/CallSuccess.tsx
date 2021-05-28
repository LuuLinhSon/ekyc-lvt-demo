import React from 'react';
import './CallSuccess.scss';

import { useHistory, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import TICK_ICON from '../../../../assets/images/check-circle-green.png';
import REJECT_ICON from '../../../../assets/images/reject.png';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import useStepperStore from 'stores/StepperStore/stepper';
import RoutesString from 'pages/routesString';

const CallSuccess: React.FC<any> = ({ action }) => {
  const isApprove = action === 'APPROVE';
  const [, actionAuthentication] = useAuthentication();
  const [, actionStepper] = useStepperStore();
  const history = useHistory();

  const logout = async () => {
    await actionAuthentication.logout();
    await actionStepper.resetStepper();
    history.push(RoutesString.StepOne, {});
  };

  return (
    <div className="container">
      <>
        <div className="d-flex justify-content-center mb-5">
          {isApprove
            ? 'Chúc mừng quý khách đã thực hiện thành công cuộc gọi định danh'
            : 'Rất lấy làm tiếc. Hồ sơ của quý khách không đạt yêu cầu'}
        </div>
        <div className="mb-4 d-flex justify-content-center">
          <img src={isApprove ? TICK_ICON : REJECT_ICON} className="d-block" alt="LOGO_ALT" height="100" />
        </div>
      </>
      <div className="wrapper-button">
        <Button className="action-button" variant="contained" color="primary" onClick={logout}>
          Quay về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default withRouter(CallSuccess);
