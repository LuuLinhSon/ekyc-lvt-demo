import DrawBox from 'components/drawBox/DrawBox';
import { FaceDetection } from 'face-api.js/build/commonjs/classes/FaceDetection';
import { FaceLandmarks68 } from 'face-api.js/build/commonjs/classes/FaceLandmarks68';
import { WithFaceDescriptor } from 'face-api.js/build/commonjs/factories/WithFaceDescriptor';
import { WithFaceLandmarks } from 'face-api.js/build/commonjs/factories/WithFaceLandmarks';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Button } from 'reactstrap';
// import { Button } from 'reactstrap';
import { getFullFaceDescription, loadModels } from '../../face-api/face';

const WIDTH = 420;
const HEIGHT = 350;
const inputSize = 160;

const CameraFaceDetect: React.FC<RouteComponentProps> = (props) => {
  const webcamRef = useRef<Webcam>(null);
  const [fullDesc, setFullDesc] =
    useState<WithFaceDescriptor<WithFaceLandmarks<{ detection: FaceDetection }, FaceLandmarks68>>[] | null>(null);
  let timer: any = null;
  // useEffect(() => {

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [fullDesc]);

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
    }, 1500);
  };

  const capture = async () => {
    if (!!webcamRef.current && webcamRef.current.getScreenshot() !== null) {
      await getFullFaceDescription(webcamRef.current.getScreenshot(), inputSize).then((fullDesc) =>
        setFullDesc(fullDesc),
      );
    }
  };

  const checkLandmarks = () => {
    // if (fullDesc === null) return;
    // const landmarks = fullDesc[0].landmarks;
    // const jawOutline = landmarks.getJawOutline();
    // const nose = landmarks.getNose();
    // const mouth = landmarks.getMouth();
    // const leftEye = landmarks.getLeftEye();
    // const rightEye = landmarks.getRightEye();
    // const leftEyeBbrow = landmarks.getLeftEyeBrow();
    // const rightEyeBrow = landmarks.getRightEyeBrow();
    // console.log('jawOutline', jawOutline);
    // console.log('nose', nose);
    // console.log('mouth', mouth);
    // console.log('leftEye', leftEye);
    // console.log('rightEye', rightEye);
    // console.log('leftEyeBbrow', leftEyeBbrow);
    // console.log('rightEyeBrow', rightEyeBrow);
  };

  // console.log('fullDesc', fullDesc);

  return (
    <div
      className="Camera"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
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
          {!!fullDesc ? <DrawBox fullDesc={fullDesc} imageWidth={WIDTH} boxColor={'blue'} /> : null}
        </div>
      </div>
      <Button color="primary" onClick={checkLandmarks}>
        Add
      </Button>
    </div>
  );
};

export default withRouter(CameraFaceDetect);
