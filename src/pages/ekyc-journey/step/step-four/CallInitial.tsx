import React, { useEffect } from 'react';
import './CallInitial.scss';

import { useHistory, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import TICK_ICON from '../../../../assets/images/check-circle-green.png';
import USER_ICON from '../../../../assets/images/userhihi.png';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import useStepperStore from 'stores/StepperStore/stepper';
import RoutesString from 'pages/routesString';

const InitialCall: React.FC<any> = ({ isRingRing, makeCall, nextStep, prepareCall }) => {
  const [, actionAuthentication] = useAuthentication();
  const [, actionStepper] = useStepperStore();
  const history = useHistory();
  useEffect(() => {
    if (!prepareCall) return nextStep();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepareCall]);

  const logout = async () => {
    await actionAuthentication.logout();
    await actionStepper.resetStepper();
    history.push(RoutesString.StepOne, {});
  };

  const makeCallVideo = () => {
    makeCall();
  };

  return (
    <div className="container">
      <>
        <div className="d-flex justify-content-center mb-5">Chúc mừng quý khách đã xác thực thành công</div>
        <div className="mb-4 d-flex justify-content-center">
          <img src={TICK_ICON} className="d-block" alt="LOGO_ALT" height="100" />
        </div>
        {isRingRing && (
          <div className="ring-ring">
            <span className="header-text">CUỘC GỌI ĐỊNH DANH</span>
            <div className="mb-4 d-flex justify-content-center">
              <img src={USER_ICON} className="d-block" alt="LOGO_ALT" height="150" />
            </div>
            <span className="loading">Đang kết nối với tổng đài viên</span>
          </div>
        )}
      </>
      <div className="wrapper-button">
        {isRingRing ? (
          <>
            <Button className="action-button" variant="contained" color="primary" onClick={logout}>
              Bỏ qua
            </Button>
            <Button className="action-button bg-danger" variant="contained" color="primary" onClick={logout}>
              Hủy bỏ
            </Button>
          </>
        ) : (
          <>
            <Button className="action-button" variant="contained" color="primary" onClick={logout}>
              Bỏ qua
            </Button>
            <Button className="action-button" variant="contained" color="primary" onClick={makeCallVideo}>
              Gọi video
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(InitialCall);
