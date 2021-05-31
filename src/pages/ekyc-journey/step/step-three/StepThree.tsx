import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DrawBox from 'components/drawBox/DrawBox';
import { FaceDetection } from 'face-api.js/build/commonjs/classes/FaceDetection';
import { FaceLandmarks68 } from 'face-api.js/build/commonjs/classes/FaceLandmarks68';
import { WithFaceDescriptor } from 'face-api.js/build/commonjs/factories/WithFaceDescriptor';
import { WithFaceLandmarks } from 'face-api.js/build/commonjs/factories/WithFaceLandmarks';
import { getFullFaceDescription } from '../../../../face-api/face';
import { get, isEmpty, isNull } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import RoutesString from 'pages/routesString';
import Webcam from 'react-webcam';
import API from 'api';

import './StepThree.scss';
import useStepperStore from 'stores/StepperStore/stepper';
import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import { useTimer } from 'use-timer';
import { useStoreAPI } from 'api/storeAPI';
import { notify } from 'components/toast/Toast';
const sha1 = require('js-sha1');
const MicRecorder = require('mic-recorder-to-mp3');

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
    url: 'https://ekycsandbox.lienviettech.vn/lv24/rest/web/request',
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
          <span className="loading-info">Vui lòng đưa khuôn mặt tương ứng với khung màu vàng</span>
        </div>
      );
    case 1:
      return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 p-2">
          <div>
            <span className="font-weight-bold">Bước 3-2</span>: Xác thực khuôn mặt gần
          </div>
          <span className="loading-info">Di chuyển khuôn mặt lại gần tương ứng với khung màu vàng</span>
        </div>
      );
    case 2:
      return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 p-2">
          <div>
            <span className="font-weight-bold">Bước 3-3</span>: Đọc dãy số
          </div>
          <span className="loading-info">Vui lòng đọc chính xác dãy số sau</span>
        </div>
      );
    default:
      return 'Unknown step';
  }
};

const StepThree: React.FC<any> = (props) => {
  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);
  const history = useHistory();
  const location = useLocation();
  const [, actionStoreAPI] = useStoreAPI();
  const [stateAuthentication, actionAuthentication] = useAuthentication();
  const [stateStepper, actionStepper] = useStepperStore();
  const [imgsrc, setImgSrc] = useState<SourceLive[]>([]);
  const [isCheckFaceNear, setIsCheckFaceNear] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [fullDesc, setFullDesc] =
    useState<WithFaceDescriptor<WithFaceLandmarks<{ detection: FaceDetection }, FaceLandmarks68>>[] | null>(null);
  const { time, start, reset } = useTimer({
    initialTime: 10,
    endTime: 0,
    timerType: 'DECREMENTAL',
  });

  let timer: any = null;
  const numberVerifyList = stateAuthentication?.numberVerify?.split(',');

  useEffect(() => {
    setInputDevice();

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
    if (isCurrentPage) return;
    history.push(stateStepper.currentPathStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (time === 0) {
      recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
          // do what ever you want with buffer and blob
          // Example: Create a mp3 file and play
          const file = new File(buffer, 'me-at-thevoice.mp3', {
            type: blob.type,
            lastModified: Date.now(),
          });

          const ekycId = stateAuthentication?.ekycId || '';
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = async function () {
            const base64data = reader.result?.toString();
            const base64 = base64data?.split(',')[1] || '';
            const audioLive = {
              label: 'audio_verify',
              base64,
              secureHash: sha1(base64) || '',
              metadata: 'mp3',
            };

            try {
              actionStoreAPI.setFetching(true);
              const verifyEKYCResponse = await verifyEKYC(audioLive, imgsrc, ekycId, stateAuthentication);
              const resultCode = get(verifyEKYCResponse, 'body.resultCode', '');
              const resultDesc = get(verifyEKYCResponse, 'body.resultDesc', '');
              const actionError = get(verifyEKYCResponse, 'body.actionError', '');
              console.log('actionError', actionError);

              if (resultCode === 'ESM-0002') {
                actionAuthentication.logout();
                actionStepper.resetStepper();
                history.push(RoutesString.StepOne, {});
                notify.error(resultDesc);
                return;
              }

              if (resultCode === '0' || resultCode === 'EKYC-0010') {
                history.push(RoutesString.StepFour);
                actionStepper.setCurrentPathStep(RoutesString.StepFour);
                actionStepper.nextStep();
                return;
              }

              if (resultCode !== '0' && actionError === 'NUMBER') {
                reset();
                start();
                notify.error(resultDesc);
                return;
              }

              setImgSrc([]);
              setIsCheckFaceNear(false);
              reset();
              notify.error(resultDesc);
            } catch (e) {
              setImgSrc([]);
              setIsCheckFaceNear(false);
              reset();
              notify.error('Đã xảy ra lỗi vui lòng thử lại');
            } finally {
              actionStoreAPI.setFetching(false);
            }
          };
        })
        .catch((e) => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    if (imgsrc.length === 1) {
      setIsCheckFaceNear(true);
    }

    if (imgsrc.length === 2) {
      start();
      recorder
        .start()
        .then(() => {
          // something else
        })
        .catch((e) => {});
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
      label: imgsrc.length === 0 ? 'far' : 'near',
      base64,
      secureHash: sha1(base64),
    };

    imageSrc && setImgSrc([...imgsrc, imgLive]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullDesc]);

  return (
    <div className="container">
      {getStepContent(imgsrc.length)}
      {imgsrc.length === 2 ? null : isEmpty(fullDesc) || isNull(fullDesc) ? (
        <span className="loading">Đang tìm kiếm khuôn mặt</span>
      ) : fullDesc?.length > 1 ? (
        <span className="loading">Có quá nhiều người trong camera</span>
      ) : null}
      {imgsrc.length === 2 && (
        <span>
          Bạn còn <span className="text-time">{time}</span> giây
        </span>
      )}
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
      >
        {imgsrc.length === 2 ? (
          <div className="wrapper">
            <div className="list-images-wrapper">
              {numberVerifyList?.map((num, inx) => {
                return (
                  <div className="number-item" key={inx}>
                    {num}
                  </div>
                );
              })}
            </div>
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
              {fullDesc ? (
                <DrawBox
                  checkFaceNear={null}
                  fullDesc={fullDesc}
                  screenshot={() => {}}
                  imageWidth={WIDTH}
                  boxColor={'blue'}
                  notShowFrame={true}
                />
              ) : null}
            </div>
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
    </div>
  );
};

export default StepThree;
