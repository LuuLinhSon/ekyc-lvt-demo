import { Button } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DrawBox from 'components/drawBox/DrawBox';
import { FaceDetection } from 'face-api.js/build/commonjs/classes/FaceDetection';
import { FaceLandmarks68 } from 'face-api.js/build/commonjs/classes/FaceLandmarks68';
import { WithFaceDescriptor } from 'face-api.js/build/commonjs/factories/WithFaceDescriptor';
import { WithFaceLandmarks } from 'face-api.js/build/commonjs/factories/WithFaceLandmarks';
import { getFullFaceDescription, loadModels } from '../../../../face-api/face';
import { isEmpty, isNull } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import RoutesString from 'pages/routesString';
import Webcam from 'react-webcam';

import './StepThree.scss';

const WIDTH = 420;
const HEIGHT = 350;
const inputSize = 160;

const getStepContent = (path: string) => {
  switch (path) {
    case RoutesString.StepThreeOne:
      return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 p-2">
          <div>
            <span className="font-weight-bold">Bước 3-1</span>: Xác thực khuôn mặt
          </div>
          <span className="text-center mt-2">Vui lòng để khuôn mặt vừa với khung màu vàng</span>
        </div>
      );
    case RoutesString.StepTreeTwo:
      return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 p-2">
          <div>
            <span className="font-weight-bold">Bước 3-2</span>: Xác thực khuôn mặt
          </div>
          <span className="text-center mt-2">Vui lòng để khuôn mặt vừa với khung màu vàng</span>
        </div>
      );
    default:
      return 'Unknown step';
  }
};

const StepThree: React.FC<any> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const isStepThreeOne = location?.pathname === RoutesString.StepThreeOne;
  const [imgsrc, setImgSrc] = useState<any>(undefined);
  const webcamRef = useRef<Webcam>(null);
  const [fullDesc, setFullDesc] =
    useState<WithFaceDescriptor<WithFaceLandmarks<{ detection: FaceDetection }, FaceLandmarks68>>[] | null>(null);
  let timer: any = null;

  useEffect(() => {
    loadModels();
    setInputDevice();

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      const inputDevice = await devices.filter((device) => device.kind === 'videoinput');
      startCapture();
      // tslint:disable-next-line:no-console
      console.log('inputDevice', inputDevice);
    });
  };

  const startCapture = () => {
    timer = setInterval(() => {
      capture();
    }, 500);
  };

  const capture = async () => {
    if (!!webcamRef.current && webcamRef.current.getScreenshot() !== null) {
      await getFullFaceDescription(webcamRef.current.getScreenshot(), inputSize).then((fullDesc) =>
        setFullDesc(fullDesc),
      );
    }
  };

  const screenshot = useCallback(() => {
    if (isEmpty(fullDesc) || isNull(fullDesc) || fullDesc?.length > 1) return;
    const imageSrc = webcamRef?.current?.getScreenshot();

    setImgSrc(imageSrc);
    // tslint:disable-next-line:no-console
    console.log('imageSrc', imageSrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullDesc]);

  const next = () => {
    isStepThreeOne ? history.push(RoutesString.StepTreeTwo) : history.push(RoutesString.StepThreeThree);
  };

  return (
    <div className="container">
      {getStepContent(location?.pathname)}
      {isEmpty(fullDesc) || isNull(fullDesc) ? (
        <span className="loading">Đang tìm kiếm khuôn mặt</span>
      ) : fullDesc?.length > 1 ? (
        <span className="loading">Có quá nhiều người trong camera</span>
      ) : null}
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
      >
        <div style={{ position: 'relative', width: WIDTH }}>
          <div style={{ position: 'absolute' }}>
            {imgsrc ? (
              <img src={imgsrc} alt="" width={WIDTH} height={HEIGHT} />
            ) : (
              <Webcam
                audio={false}
                width={WIDTH}
                height={HEIGHT}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={true}
              />
            )}
          </div>
          {!imgsrc && !!fullDesc ? (
            <DrawBox
              checkFaceNear={isStepThreeOne ? true : false}
              fullDesc={fullDesc}
              screenshot={screenshot}
              imageWidth={WIDTH}
              boxColor={'blue'}
            />
          ) : null}
        </div>
      </div>

      <Button
        disabled={isEmpty(fullDesc) || isNull(fullDesc) || fullDesc?.length > 1}
        className="next-button"
        variant="contained"
        color="primary"
        onClick={next}
      >
        Tiếp
      </Button>
    </div>
  );
};

export default StepThree;
