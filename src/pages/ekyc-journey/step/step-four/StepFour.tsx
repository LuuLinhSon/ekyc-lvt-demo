import React, { useEffect, useRef, useState } from 'react';
import './StepFour.scss';
import API from 'api';

import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import publicIp from 'public-ip';
import { get } from 'lodash';
import StepWizard from 'react-step-wizard';
import CallVideo from './CallVideo';
import InitialCall from './CallInitial';
import useStepperStore from 'stores/StepperStore/stepper';
import RoutesString from 'pages/routesString';
import CallSuccess from './CallSuccess';

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

const getAccessToken = async (stateAuthentication: AuthenticationStates) => {
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
        clientAddress: await publicIp.v4(),
        platform: 'LOCAL',
        function: 'getAccessTokenVideoCall ',
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
          custId: stateAuthentication.user.custId,
          custNo: stateAuthentication.user.custNo,
          userName: stateAuthentication.user.userName,
          authorizedMode: 0,
          checkerMode: 0,
          ip: await publicIp.v4(),
          makerId: 'SONLL',
          language: 'VN',
        },
      },
    },
  });

  return initEKYCResponse;
};

const settingClientEvents = (
  client,
  call,
  remoteVideo,
  localVideo,
  setIsRingRing,
  setPrepareCall,
  setDataFromServer,
  setAction,
) => {
  client.on('connect', function () {
    console.log('++++++++++++++ connected to StringeeServer');
  });

  client.on('authen', function (res) {
    console.log('authen', res);
  });

  client.on('disconnect', function () {
    console.log('++++++++++++++ disconnected: ');
  });

  client.on('custommessage', function (info) {
    console.log('on info:' + JSON.stringify(info));
    const action = get(info, 'message.action', '');
    setDataFromServer(get(info, 'message.payload', {}));
    setAction(action);
  });

  client.on('incomingcall2', function (incomingcall2) {
    call = incomingcall2;
    settingCallEvent(
      incomingcall2,
      remoteVideo,
      localVideo,
      setIsRingRing,
      setPrepareCall,
      setDataFromServer,
      setAction,
    );

    call.ringing(function (res) {});

    console.log('++++++++++++++ incomingcall2', incomingcall2);
  });

  client.on('requestnewtoken', function () {
    console.log(
      '++++++++++++++ requestnewtoken; please get new access_token from YourServer and call client.connect(new_access_token)+++++++++',
    );
  });
};

const callStarted = () => {
  console.log('CALL_STARTED');
};

const callEnded = () => {
  console.log('CALL_ENDED');
};

const settingCallEvent = (
  call1,
  remoteVideo,
  localVideo,
  setIsRingRing,
  setPrepareCall,
  setDataFromServer,
  setAction,
) => {
  console.log('localVideo', localVideo);

  callStarted();
  call1.on('addremotestream', function (stream) {
    console.log('addremotestream');
    // reset srcObject to work around minor bugs in Chrome and Edge.
    remoteVideo.current.srcObject = null;
    remoteVideo.current.srcObject = stream;
  });

  call1.on('addlocalstream', function (stream) {
    console.log('addlocalstream');
    // reset srcObject to work around minor bugs in Chrome and Edge.
    localVideo.current.srcObject = null;
    localVideo.current.srcObject = stream;
  });

  call1.on('error', function (info) {
    console.log('on error: ' + JSON.stringify(info));
  });

  call1.on('signalingstate', function (state) {
    console.log('signalingstate ', state);
    if (state.code === 6) {
      callEnded();
      setAction('ENDED');
    } else if (state.code === 5) {
      callEnded();
      setAction('ENDED');
    } else if (state.code === 3) {
      setIsRingRing(false);
      setPrepareCall(false);
    }
  });

  call1.on('mediastate', function (state) {
    console.log('mediastate ', state);
  });

  call1.on('info', function (info) {
    console.log('on info:' + JSON.stringify(info));
  });

  call1.on('otherdevice', function (data) {
    console.log('on otherdevice:' + JSON.stringify(data));
    if ((data.type === 'CALL_STATE' && data.code >= 200) || data.type === 'CALL_END') {
      setAction('ENDED');
      callEnded();
    }
  });
};

const StepFour: React.FC<any> = (props) => {
  const global: any = window;
  let call: any = null;
  const location = useLocation();
  const [stringeeClient] = useState<any>(new global.StringeeClient());
  const [isRingRing, setIsRingRing] = useState<boolean>(false);
  const [prepareCall, setPrepareCall] = useState<boolean>(true);
  const [dataFromServer, setDataFromServer] = useState(null);
  const [action, setAction] = useState(false);
  const remoteVideo = useRef(null);
  const localVideo = useRef(null);
  const [stateAuthentication, actionAuthentication] = useAuthentication();
  const [stateStepper, actionStepper] = useStepperStore();
  const history = useHistory();

  useEffect(() => {
    const initVideoCall = async function () {
      const response = await getAccessToken(stateAuthentication);
      const accessToken = get(response, 'body.accessToken', '');
      settingClientEvents(
        stringeeClient,
        call,
        remoteVideo,
        localVideo,
        setIsRingRing,
        setPrepareCall,
        setDataFromServer,
        setAction,
      );
      stringeeClient?.connect(accessToken);
    };
    initVideoCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isCurrentPage = stateStepper.currentPathStep === location?.pathname;
    if (isCurrentPage) return;
    history.push(stateStepper.currentPathStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeCall = (videocall) => {
    setIsRingRing(true);
    call = new global.StringeeCall2(stringeeClient, 'FROM_YOUR_NUMBER', 'user_2', videocall);
    settingCallEvent(call, remoteVideo, localVideo, setIsRingRing, setPrepareCall, setDataFromServer, setAction);

    call.makeCall(function (res) {
      console.log('make call callback: ' + JSON.stringify(res));
    });
  };

  const logout = async () => {
    await actionAuthentication.logout();
    await actionStepper.resetStepper();
    history.push(RoutesString.StepOne, {});
  };

  const rejectCall = () => {
    setPrepareCall(true);
    setIsRingRing(false);
    logout();
  };

  return (
    <div className="container">
      <StepWizard>
        <InitialCall isRingRing={isRingRing} makeCall={makeCall} prepareCall={prepareCall} />
        <CallVideo
          remoteVideo={remoteVideo}
          localVideo={localVideo}
          dataFromServer={dataFromServer}
          rejectCall={rejectCall}
          action={action}
        />
        <CallSuccess action={action} />
      </StepWizard>
    </div>
  );
};

export default withRouter(StepFour);
