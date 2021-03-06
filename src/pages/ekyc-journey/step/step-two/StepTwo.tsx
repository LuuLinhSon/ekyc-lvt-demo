import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import CMND_CCCD from 'assets/images/cmnd.png';
import './StepTwo.scss';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import RoutesString from 'pages/routesString';
import useStepperStore from 'stores/StepperStore/stepper';

const StepTwo: React.FC<any> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [stateStepper, actionStepper] = useStepperStore();
  const nextToStep = () => {
    history.push(RoutesString.StepTwoTwo);
    actionStepper.setCurrentPathStep(RoutesString.StepTwoTwo);
  };

  useEffect(() => {
    const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
    if (isCurrentPage) return;
    history.push(stateStepper.currentPathStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-center mb-5">
        <span className="font-weight-bold">Bước 2</span>: Chụp ảnh CMND/CCCD
      </div>
      <span className="heading-title">HƯỚNG DẪN</span>
      <span className="heading-title">Chụp ảnh Chứng minh thư/Thẻ căn cước</span>
      <div className="description-container">
        <ul>
          <li>Giấy tờ còn hạn là sử dụng. Là hình gốc, không scan và photocopy</li>
          <li>Chụp ảnh trong môi trường đủ sáng</li>
          <li>Đảm bảo ảnh rõ nét, không bị mờ loá</li>
        </ul>
        <img src={CMND_CCCD} className="d-block" alt="LOGO_ALT" width="100%" />
      </div>
      <Button className="next-button" variant="contained" color="primary" onClick={nextToStep}>
        Tiếp tục
      </Button>
    </div>
  );
};

export default withRouter(StepTwo);
