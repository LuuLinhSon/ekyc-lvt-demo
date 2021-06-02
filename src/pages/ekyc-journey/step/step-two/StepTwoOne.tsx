import { Button } from '@material-ui/core';
import RoutesString from 'pages/routesString';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import API from 'api';
import ImageUploading from 'react-images-uploading';
import Webcam from 'react-webcam';
import useStepperStore from 'stores/StepperStore/stepper';

import './StepTwoOne.scss';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import { get, isEmpty, omit } from 'lodash';
import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
// import { useAlert } from 'react-alert';
import { useStoreAPI } from 'api/storeAPI';
import { notify } from 'components/toast/Toast';

const sha1 = require('js-sha1');

// import publicIp from 'public-ip';
// import moment from 'moment';

const WIDTH = 420;
const HEIGHT = 350;

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

const initEKYC = async (stateAuthentication: AuthenticationStates) => {
  const timestamp = new Date().getTime();
  const clientTime = getDate();
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const initEKYCResponse = await API({
    url: 'https://ekycsandbox.lienviettech.vn/lv24/rest/web/request',
    method: 'POST',
    headers,
    data: {
      clientHeader: {
        language: 'VN',
        clientRequestId: `${timestamp}`,
        deviceId: 'WEB_TEST',
        clientAddress: '192.168.201.140',
        platform: 'LOCAL',
        function: 'initTransEKYC',
      },
      body: {
        header: {
          platform: 'LOCAL',
          clientRequestId: `${timestamp}`,
          clientTime,
          zonedClientTime: `${timestamp}`,
          channelCode: 'WEBVIVIET',
          deviceId: 'WEB_TEST',
          sessionId: stateAuthentication.session.sessionId,
          userId: stateAuthentication.session.userId,
          authorizedMode: 0,
          checkerMode: 0,
          ip: '192.168.201.140',
          makerId: 'SONLL',
          language: 'VN',
        },
        ekycAction: 'IDENTIFY',
      },
    },
  });

  return initEKYCResponse;
};

const ocrFrontEKYC = async (base64: string, ekycId: string, stateAuthentication: AuthenticationStates) => {
  const timestamp = new Date().getTime();
  const clientTime = getDate();
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const ocrFrontResponse = await API({
    url: 'https://ekycsandbox.lienviettech.vn/lv24/rest/web/request',
    method: 'POST',
    headers,
    data: {
      clientHeader: {
        language: 'VN',
        clientRequestId: `${timestamp + 1000}`,
        deviceId: 'TESTDEMO',
        clientAddress: '192.168.201.140',
        platform: 'LOCAL',
        function: 'ocrVerify',
      },
      body: {
        header: {
          platform: 'LOCAL',
          clientRequestId: `${timestamp + 1000}`,
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
          actionCode: 'OCR_FRONT_IMAGE',
        },
        cardType: '',
        ekycId,
        image: {
          label: 'FRONT_IMAGE_OCR',
          base64,
          secureHash: sha1(base64),
        },
      },
    },
  });

  return ocrFrontResponse;
};

const checkConfidence = (confidence: string) => {
  return confidence === 'Y' ? false : true;
};

const ocrBackEKYC = async (base64: string, ekycId: string, stateAuthentication: AuthenticationStates) => {
  const timestamp = new Date().getTime();
  const clientTime = getDate();
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const ocrFrontResponse = await API({
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
        function: 'ocrVerify',
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
          actionCode: 'OCR_BACK_IMAGE',
        },
        cardType: '',
        ekycId,
        image: {
          label: 'BACK_IMAGE_OCR',
          base64,
          secureHash: sha1(base64),
        },
      },
    },
  });

  return ocrFrontResponse;
};

const redirectPage = (actionAuthentication: any, actionStepper: any, history: any, actionError: string) => {
  switch (actionError) {
    case 'ALL': {
      actionStepper.setCurrentPathStep(RoutesString.StepTwoTwo);
      history.push(RoutesString.StepTwoTwo);
      actionAuthentication.setActionError('ALL');
      return;
    }
    case 'OCR_FRONT_IMAGE': {
      actionStepper.setCurrentPathStep(RoutesString.StepTwoTwo);
      history.push(RoutesString.StepTwoTwo);
      actionAuthentication.setActionError('OCR_FRONT_IMAGE');
      return;
    }
    case 'OCR_BACK_IMAGE':
      return actionAuthentication.setActionError('OCR_BACK_IMAGE');
    default:
      return;
  }
};

const StepTwoScreenshot: React.FC<any> = (props) => {
  const [images, setImages] = useState<any>([]);
  const [, actionStoreAPI] = useStoreAPI();
  const webcamRef = useRef<Webcam>(null);
  const [stateStepper, actionStepper] = useStepperStore();
  const [stateAuthentication, actionAuthentication] = useAuthentication();
  const history = useHistory();
  const location = useLocation();
  // const alert = useAlert();

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

  const captureFront = async (isCapture: boolean) => {
    const imageSrc = await webcamRef?.current?.getScreenshot();
    const base64 = isCapture ? imageSrc?.split(',')[1] || '' : images[0]?.data_url.split(',')[1] || '';

    try {
      actionStoreAPI.setFetching(true);
      const initEKYCResponse = await initEKYC(stateAuthentication);
      const ekycId = get(initEKYCResponse, 'body.ekycId', '');
      const paramsNumberVerify = get(initEKYCResponse, 'body.params', []).find(
        (element) => element.key === 'A3_LIST_NUMBER',
      );
      actionAuthentication.setNumberVerify(paramsNumberVerify.value);
      actionAuthentication.setEkycId(ekycId);
      const ocrFrontEKYCResponse = await ocrFrontEKYC(base64, ekycId, stateAuthentication);
      const resultCode = get(ocrFrontEKYCResponse, 'body.resultCode', '');
      const resultDesc = get(ocrFrontEKYCResponse, 'body.resultDesc', '');
      const actionError = get(ocrFrontEKYCResponse, 'body.actionError', '');
      const ocrInformation = omit(get(ocrFrontEKYCResponse, 'body', {}), ['resultCode', 'resultDesc']);
      const ocrInformationByType = {
        name: get(ocrInformation, 'name'),
        id: get(ocrInformation, 'id'),
        brithDay: get(ocrInformation, 'brithDay'),
        province: get(ocrInformation, 'province'),
        address: get(ocrInformation, 'address'),
        people: get(ocrInformation, 'people'),
        expireDate: get(ocrInformation, 'expireDate'),
        issueDate: get(ocrInformation, 'issueDate'),
        sex: get(ocrInformation, 'sex'),
        sign: get(ocrInformation, 'sign'),
        time: get(ocrInformation, 'time'),
        cardType: get(ocrInformation, 'cardType'),
        provinceCode: get(ocrInformation, 'cityCode'),
        districtCode: get(ocrInformation, 'districtCode'),
        precinctCode: get(ocrInformation, 'wardCode'),
        provinceDetail: {
          city: get(ocrInformation, 'provinceDetail.city'),
          district: get(ocrInformation, 'provinceDetail.district'),
          precinct: get(ocrInformation, 'provinceDetail.precinct'),
          streetName: get(ocrInformation, 'provinceDetail.streetName'),
        },
        nameConfidence: checkConfidence(get(ocrInformation, 'nameConfidence')),
        idConfidence: checkConfidence(get(ocrInformation, 'idConfidence')),
        brithDayConfidence: checkConfidence(get(ocrInformation, 'brithDayConfidence')),
        provinceConfidence: checkConfidence(get(ocrInformation, 'provinceConfidence')),
        addressConfidence: checkConfidence(get(ocrInformation, 'addressConfidence')),
        peopleConfidence: checkConfidence(get(ocrInformation, 'peopleConfidence')),
        expireDateConfidence: checkConfidence(get(ocrInformation, 'expireDateConfidence')),
        issueDateConfidence: checkConfidence(get(ocrInformation, 'issueDateConfidence')),
        sexConfidence: checkConfidence(get(ocrInformation, 'sexConfidence')),
        signConfidence: checkConfidence(get(ocrInformation, 'signConfidence')),
        timeConfidence: checkConfidence(get(ocrInformation, 'timeConfidence')),
      };

      if (
        (resultCode === '0' && stateAuthentication.actionError === 'ALL') ||
        (resultCode === '0' && stateAuthentication.actionError === null)
      ) {
        actionAuthentication.setActionError(null);
        history.push(RoutesString.StepTwoThree);
        actionStepper.setCurrentPathStep(RoutesString.StepTwoThree);
        return;
      }

      if (resultCode === '0' && stateAuthentication.actionError === 'OCR_FRONT_IMAGE') {
        actionAuthentication.setActionError(null);
        actionAuthentication.setOcrInformation(ocrInformationByType);
        history.push(RoutesString.StepEditKYC);
        actionStepper.setCurrentPathStep(RoutesString.StepEditKYC);
        return;
      }

      actionAuthentication.setActionError(isEmpty(actionError) ? null : actionError);
      notify.error(resultDesc);
    } catch (e) {
      notify.error('Đã xảy ra lỗi vui lòng thử lại');
    } finally {
      actionStoreAPI.setFetching(false);
    }
  };

  const captureBack = async (isCapture: boolean) => {
    const imageSrc = await webcamRef?.current?.getScreenshot();
    const base64 = isCapture ? imageSrc?.split(',')[1] || '' : images[0]?.data_url.split(',')[1] || '';
    const ekycId = stateAuthentication?.ekycId || '';
    try {
      actionStoreAPI.setFetching(true);
      const ocrBackEKYCResponse = await ocrBackEKYC(base64, ekycId, stateAuthentication);
      const resultCode = get(ocrBackEKYCResponse, 'body.resultCode', '');
      const resultDesc = get(ocrBackEKYCResponse, 'body.resultDesc', '');
      const actionError = get(ocrBackEKYCResponse, 'body.actionError', '');
      const ocrInformation = omit(get(ocrBackEKYCResponse, 'body', {}), ['resultCode', 'resultDesc']);
      const ocrInformationByType = {
        name: get(ocrInformation, 'name'),
        id: get(ocrInformation, 'id'),
        brithDay: get(ocrInformation, 'brithDay'),
        province: get(ocrInformation, 'province'),
        address: get(ocrInformation, 'address'),
        people: get(ocrInformation, 'people'),
        expireDate: get(ocrInformation, 'expireDate'),
        issueDate: get(ocrInformation, 'issueDate'),
        sex: get(ocrInformation, 'sex'),
        sign: get(ocrInformation, 'sign'),
        time: get(ocrInformation, 'time'),
        cardType: get(ocrInformation, 'cardType'),
        provinceCode: get(ocrInformation, 'cityCode'),
        districtCode: get(ocrInformation, 'districtCode'),
        precinctCode: get(ocrInformation, 'wardCode'),
        provinceDetail: {
          city: get(ocrInformation, 'provinceDetail.city'),
          district: get(ocrInformation, 'provinceDetail.district'),
          precinct: get(ocrInformation, 'provinceDetail.precinct'),
          streetName: get(ocrInformation, 'provinceDetail.streetName'),
        },
        nameConfidence: checkConfidence(get(ocrInformation, 'nameConfidence')),
        idConfidence: checkConfidence(get(ocrInformation, 'idConfidence')),
        brithDayConfidence: checkConfidence(get(ocrInformation, 'brithDayConfidence')),
        provinceConfidence: checkConfidence(get(ocrInformation, 'provinceConfidence')),
        addressConfidence: checkConfidence(get(ocrInformation, 'addressConfidence')),
        peopleConfidence: checkConfidence(get(ocrInformation, 'peopleConfidence')),
        expireDateConfidence: checkConfidence(get(ocrInformation, 'expireDateConfidence')),
        issueDateConfidence: checkConfidence(get(ocrInformation, 'issueDateConfidence')),
        sexConfidence: checkConfidence(get(ocrInformation, 'sexConfidence')),
        signConfidence: checkConfidence(get(ocrInformation, 'signConfidence')),
        timeConfidence: checkConfidence(get(ocrInformation, 'timeConfidence')),
      };

      if (resultCode === '0') {
        actionAuthentication.setOcrInformation(ocrInformationByType);
        history.push(RoutesString.StepEditKYC);
        actionStepper.setCurrentPathStep(RoutesString.StepEditKYC);
        return;
      }

      await redirectPage(actionAuthentication, actionStepper, history, actionError);

      notify.error(resultDesc);
    } catch (e) {
      notify.error('Đã xảy ra lỗi vui lòng thử lại');
    } finally {
      actionStoreAPI.setFetching(false);
    }
  };

  const onChange = (imageList) => {
    setImages(imageList);
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
        {images.length === 0 ? (
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
        ) : (
          <div className="wrapper-list-image">
            {images?.map((image: any, index) => {
              const dataUrl = image.data_url;
              return (
                <div key={index} className="d-flex justify-content-center">
                  <img src={dataUrl} className="d-block" alt="CMND" width={WIDTH} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="wrapper-button">
        {images.length === 0 ? (
          <Button
            className="next-button-capture"
            variant="contained"
            color="primary"
            onClick={isCaptureFrontCMNDStep ? () => captureFront(true) : () => captureBack(true)}
          >
            Chụp
          </Button>
        ) : (
          <Button
            className="next-button-capture"
            variant="contained"
            color="primary"
            onClick={isCaptureFrontCMNDStep ? () => captureFront(false) : () => captureBack(false)}
          >
            Gửi ảnh
          </Button>
        )}
        <ImageUploading multiple={true} value={images} onChange={onChange} maxNumber={1} dataURLKey="data_url">
          {({ onImageUpload, onImageRemoveAll, dragProps }) => (
            <>
              {images.length === 0 && (
                <Button
                  className="next-button-capture"
                  variant="contained"
                  color="primary"
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Chọn ảnh
                </Button>
              )}
              {images.length !== 0 && (
                <Button
                  className="next-button-capture"
                  variant="contained"
                  color="primary"
                  onClick={onImageRemoveAll}
                  {...dragProps}
                >
                  Xóa ảnh
                </Button>
              )}
            </>
          )}
        </ImageUploading>
      </div>
    </div>
  );
};

export default StepTwoScreenshot;
