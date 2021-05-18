import { Button } from '@material-ui/core';
import RoutesString from 'pages/routesString';
import React, { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import useStepperStore from 'stores/StepperStore/stepper';

import './StepTwoOne.scss';

const WIDTH = 420;
const HEIGHT = 350;

const StepTwoScreenshot: React.FC<any> = (props) => {
  const webcamRef = useRef<Webcam>(null);
  const [stateStepper, actionStepper] = useStepperStore();
  const history = useHistory();
  const location = useLocation();
  const isCaptureFrontCMNDStep = location?.pathname === RoutesString.StepTwoTwo;

  useEffect(() => {
    setInputDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
    if (isCurrentPage) return;
    history.push(stateStepper.currentPathStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      await devices.filter((device) => device.kind === 'videoinput');
    });
  };

  //   const capture = useCallback(() => {
  //     const imageSrc = webcamRef?.current?.getScreenshot();
  //     // tslint:disable-next-line:no-console
  //     console.log('imageSrc', imageSrc);
  //   }, []);

  const nextToStep = () => {
    isCaptureFrontCMNDStep ? history.push(RoutesString.StepTwoThree) : history.push(RoutesString.StepThreeOne);
    !isCaptureFrontCMNDStep && actionStepper.nextStep();
    isCaptureFrontCMNDStep
      ? actionStepper.setCurrentPathStep(RoutesString.StepTwoThree)
      : actionStepper.setCurrentPathStep(RoutesString.StepThreeOne);
  };

  return (
    <div className="container">
      {isCaptureFrontCMNDStep ? (
        <div className="d-flex justify-content-center mb-5">
          <span className="font-weight-bold">Bước 2-2</span>: Chụp ảnh mặt trước
        </div>
      ) : (
        <div className="d-flex justify-content-center mb-5">
          <span className="font-weight-bold">Bước 2-3</span>: Chụp ảnh mặt sau
        </div>
      )}
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
      >
        <div style={{ position: 'relative', width: WIDTH }}>
          <div style={{ position: 'absolute' }}>
            <Webcam
              audio={false}
              width={WIDTH}
              height={HEIGHT}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={true}
            />
          </div>
        </div>
      </div>
      <Button className="next-button" variant="contained" color="primary" onClick={nextToStep}>
        Chụp
      </Button>
    </div>
  );
};

export default StepTwoScreenshot;
