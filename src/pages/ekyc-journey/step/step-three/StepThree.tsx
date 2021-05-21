import React, { useCallback, useEffect, useRef, useState } from 'react';
import DrawBox from 'components/drawBox/DrawBox';
import { FaceDetection } from 'face-api.js/build/commonjs/classes/FaceDetection';
import { FaceLandmarks68 } from 'face-api.js/build/commonjs/classes/FaceLandmarks68';
import { WithFaceDescriptor } from 'face-api.js/build/commonjs/factories/WithFaceDescriptor';
import { WithFaceLandmarks } from 'face-api.js/build/commonjs/factories/WithFaceLandmarks';
import { getFullFaceDescription, loadModels } from '../../../../face-api/face';
import { get, isEmpty, isNull } from 'lodash';
import { useHistory } from 'react-router-dom';
import RoutesString from 'pages/routesString';
import Webcam from 'react-webcam';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import API from 'api';

import './StepThree.scss';
import useStepperStore from 'stores/StepperStore/stepper';
import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import { useTimer } from 'use-timer';
import { useAlert } from 'react-alert';
const sha1 = require('js-sha1');

const WIDTH = 420;
const HEIGHT = 350;
const inputSize = 160;

interface SourceLive {
  label: string;
  base64: string;
  secureHash: string;
  metadata?: string;
}

const YYYYMMDDHHMMSS = () => {
  const date = new Date();
  const yyyy = date.getFullYear().toString();
  const MM = pad(date.getMonth() + 1, 2);
  const dd = pad(date.getDate(), 2);
  const hh = pad(date.getHours(), 2);
  const mm = pad(date.getMinutes(), 2);
  const ss = pad(date.getSeconds(), 2);
  const ms = pad(date.getMilliseconds(), 3);

  return `${yyyy}${MM}${dd}${hh}${mm}${ss}.${ms}`;
};

const getDate = () => {
  return YYYYMMDDHHMMSS();
};

const pad = (num: any, length: any) => {
  let str = `${num}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
};

const verifyEKYC = async (
  audio: SourceLive,
  imageLives: SourceLive[],
  ekycId: string,
  stateAuthentication: AuthenticationStates,
) => {
  const timestamp = new Date().getTime();
  const clientTime = getDate();
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const verifyKYCResponse = await API({
    url: 'https://stbsandbox.viviet.vn/transaction-service/rest/web/request',
    method: 'POST',
    headers,
    data: {
      clientHeader: {
        language: 'VN',
        clientRequestId: `${timestamp}`,
        deviceId: 'TESTDEMO',
        clientAddress: '192.168.201.140',
        platform: 'LOCAL',
        function: 'ekycVerify',
      },
      body: {
        header: {
          platform: 'LOCAL',
          clientRequestId: `${timestamp}`,
          clientTime,
          zonedClientTime: `${timestamp}`,
          channelCode: 'WEBVIVIET',
          deviceId: 'TESTDEMO',
          sessionId: stateAuthentication.session.sessionId,
          userId: stateAuthentication.session.userId,
          authorizedMode: 0,
          checkerMode: 0,
          ip: '192.168.201.140',
          makerId: 'SONLL',
          language: 'VN',
        },
        cardType: '',
        ekycId,
        imageLives,
        audio,
      },
    },
  });
  return verifyKYCResponse;
};

const getStepContent = (numberImg: number) => {
  switch (numberImg) {
    case 0:
      return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 p-2">
          <div>
            <span className="font-weight-bold">Bước 3-1</span>: Xác thực khuôn mặt xa
          </div>
          <span className="text-center mt-2">Vui lòng đưa khuôn mặt ra xa vừa với khung màu vàng</span>
        </div>
      );
    case 1:
      return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 p-2">
          <div>
            <span className="font-weight-bold">Bước 3-2</span>: Xác thực khuôn mặt gần
          </div>
          <span className="text-center mt-2">Vui lòng để khuôn mặt lại gần vừa với khung màu vàng</span>
        </div>
      );
    case 2:
      return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 p-2">
          <div>
            <span className="font-weight-bold">Bước 3-3</span>: Xác thực dãy số
          </div>
          <span className="text-center mt-2">Vui lòng đọc chính xác dãy số sau</span>
        </div>
      );
    default:
      return 'Unknown step';
  }
};

const StepThree: React.FC<any> = (props) => {
  const history = useHistory();
  const [stateAuthentication] = useAuthentication();
  const [, actionStepper] = useStepperStore();
  const [imgsrc, setImgSrc] = useState<SourceLive[]>([]);
  const [isCheckFaceNear, setIsCheckFaceNear] = useState<boolean>(false);
  const [recordState, setRecordState] = useState<RecordState>(null);
  const webcamRef = useRef<Webcam>(null);
  const [fullDesc, setFullDesc] =
    useState<WithFaceDescriptor<WithFaceLandmarks<{ detection: FaceDetection }, FaceLandmarks68>>[] | null>(null);
  const { time, start, reset } = useTimer({
    initialTime: 10,
    endTime: 0,
    timerType: 'DECREMENTAL',
  });

  let timer: any = null;
  const alert = useAlert();
  const numberVerifyList = stateAuthentication?.numberVerify?.split(',');

  useEffect(() => {
    loadModels();
    setInputDevice();
    // const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
    // if (isCurrentPage) {
    //   loadModels();
    //   setInputDevice();
    //   return;
    // }
    // history.push(stateStepper?.currentPathStep || '/');

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (time === 0) {
      setRecordState(RecordState.STOP);
    }
  }, [time]);

  useEffect(() => {
    if (imgsrc.length === 1) {
      setIsCheckFaceNear(true);
    }

    if (imgsrc.length === 2) {
      start();
      setRecordState(RecordState.START);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgsrc]);

  const setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      await devices.filter((device) => device.kind === 'videoinput');
      startCapture();
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
    const base64 = imageSrc?.split(',')[1] || '';
    const imgLive = {
      label: imgsrc.length === 0 ? 'far_face' : 'portrait',
      base64,
      secureHash: sha1(base64),
    };

    imageSrc && setImgSrc([...imgsrc, imgLive]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullDesc]);

  const onStop = (data) => {
    const ekycId = stateAuthentication?.ekycId || '';
    const metadata = data?.type?.split('/')[1] || '';
    const reader = new FileReader();
    reader.readAsDataURL(data.blob);
    reader.onloadend = async function () {
      const base64data = reader.result?.toString();
      const base64 = base64data?.split(',')[1] || '';
      const audioLive = {
        label: 'audio_verify',
        base64,
        secureHash: sha1(base64) || '',
        metadata,
      };

      try {
        const verifyEKYCResponse = await verifyEKYC(audioLive, imgsrc, ekycId, stateAuthentication);
        const resultCode = get(verifyEKYCResponse, 'body.resultCode', '');
        const resultDesc = get(verifyEKYCResponse, 'body.resultDesc', '');
        if (resultCode === '0') {
          history.push(RoutesString.StepFour);
          actionStepper.setCurrentPathStep(RoutesString.StepFour);
          actionStepper.nextStep();
        }
        setImgSrc([]);
        setIsCheckFaceNear(false);
        reset();
        alert.error(resultDesc);
      } catch (e) {}
    };
  };

  return (
    <div className="container">
      {getStepContent(imgsrc.length)}
      {isEmpty(fullDesc) || isNull(fullDesc) ? (
        <span className="loading">Đang tìm kiếm khuôn mặt</span>
      ) : fullDesc?.length > 1 ? (
        <span className="loading">Có quá nhiều người trong camera</span>
      ) : null}
      {imgsrc.length === 2 && <span>{time}</span>}
      {imgsrc.length === 2 && <AudioReactRecorder canvasHeight={50} state={recordState} onStop={onStop} />}
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
      >
        {imgsrc.length === 2 ? (
          <div className="list-images-wrapper">
            {numberVerifyList?.map((num, inx) => {
              return (
                <div className="number-item" key={inx}>
                  {num}
                </div>
              );
            })}
          </div>
        ) : (
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
            {fullDesc && imgsrc.length < 2 ? (
              <DrawBox
                checkFaceNear={isCheckFaceNear}
                fullDesc={fullDesc}
                screenshot={screenshot}
                imageWidth={WIDTH}
                boxColor={'blue'}
              />
            ) : null}
          </div>
        )}
      </div>

      {/* <Button
        disabled={isEmpty(fullDesc) || isNull(fullDesc) || fullDesc?.length > 1}
        className="next-button"
        variant="contained"
        color="primary"
        onClick={next}
      >
        Tiếp
      </Button> */}
    </div>
  );
};

export default StepThree;
