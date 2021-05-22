import React, { useEffect } from 'react';
import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
import StepEditKYCForm from './StepEditKYCForm';
import API from 'api';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import { get } from 'lodash';
import { useAlert } from 'react-alert';
import RoutesString from 'pages/routesString';
import useStepperStore from 'stores/StepperStore/stepper';
import { useHistory, useLocation } from 'react-router-dom';
import { useStoreAPI } from 'api/storeAPI';

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

const ocrEditEKYC = async (dataInfo: {}, ekycId: string, stateAuthentication: AuthenticationStates) => {
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
        function: 'editEKYCInfo',
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
        ekycId,
        ...dataInfo,
      },
    },
  });

  return ocrFrontResponse;
};

const StepEditKYC: React.FC<any> = (props) => {
  const [, actionStoreAPI] = useStoreAPI();
  const history = useHistory();
  const location = useLocation();
  const [stateStepper, actionStepper] = useStepperStore();
  const [stateAuthentication] = useAuthentication();
  const alert = useAlert();

  useEffect(() => {
    const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
    if (isCurrentPage) return;
    history.push(stateStepper.currentPathStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: any) => {
    const ekycId = stateAuthentication?.ekycId || '';
    const resurl = {
      fullName: values.fullName,
      fullAddress: `${values?.addressLine || ''}, ${values?.precinct} - ${values?.district} - ${values?.city}`,
      uniqueId: '1',
      uniqueValue: values.uniqueValue,
      dateOfIssue: values.dateOfIssue,
      placeOfIssue: values.placeOfIssue,
      birthDate: values.birthDate,
      gender: values.gender,
      email: values.email,
      placeId: '240',
      addressLine: values.addressLine,
    };

    try {
      actionStoreAPI.setFetching(true);
      const editKYCResponse = await ocrEditEKYC(resurl, ekycId, stateAuthentication);
      const resultCode = get(editKYCResponse, 'body.resultCode', '');
      const resultDesc = get(editKYCResponse, 'body.resultDesc', '');

      if (resultCode === '0') {
        history.push(RoutesString.StepThreeOne);
        actionStepper.nextStep();
        actionStepper.setCurrentPathStep(RoutesString.StepThreeOne);
        actionStoreAPI.setFetching(false);
        return;
      }

      actionStoreAPI.setFetching(false);
      return alert.error(resultDesc);
    } catch (e) {}
  };

  return <StepEditKYCForm handleSubmit={handleSubmit} />;
};

export default StepEditKYC;
