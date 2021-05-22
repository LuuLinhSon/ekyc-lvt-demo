// import { Button } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
// import CMND_CCCD from 'assets/images/cmnd.png';
import './StepFour.scss';
import API from 'api';

import { withRouter } from 'react-router-dom';
// import { get } from 'lodash';
import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
import useAuthentication from 'stores/AuthenticationStore/authentication';
// import useStringee from 'custom-hook/useScript';
// import RoutesString from 'pages/routesString';
// import useStepperStore from 'stores/StepperStore/stepper';
import publicIp from "public-ip";
import { get } from 'lodash';
import { Button } from '@material-ui/core';

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

const settingClientEvents = (client, call, remoteVideo, localVideo) => {
  client.on('connect', function () {
      console.log('++++++++++++++ connected to StringeeServer');
  });

  client.on('authen', function (res) {
      console.log('authen', res);
  });

  client.on('disconnect', function () {
      console.log('++++++++++++++ disconnected: ');
  });

  client.on('custommessage', function(info) {
      console.log('on info:' + JSON.stringify(info));
  });

  client.on('incomingcall2', function (incomingcall2) {
      call = incomingcall2;
      settingCallEvent(incomingcall2, remoteVideo, localVideo);

      call.ringing(function (res) {});

      console.log('++++++++++++++ incomingcall2', incomingcall2);
  });

  client.on('requestnewtoken', function () {
      console.log('++++++++++++++ requestnewtoken; please get new access_token from YourServer and call client.connect(new_access_token)+++++++++');
  });
}

const callStarted = () => {
  console.log('CALL_STARTED');
}

const callEnded = () => {
  console.log('CALL_ENDED');
}

const settingCallEvent = (call1, remoteVideo, localVideo, ) => {
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
      localVideo.current.srcObject  = null;
      localVideo.current.srcObject  = stream;
  });

  call1.on('error', function (info) {
      console.log('on error: ' + JSON.stringify(info));
  });

  call1.on('signalingstate', function (state) {
      console.log('signalingstate ', state);
      if (state.code === 6) {
          callEnded();
      } else if (state.code === 5) {
          callEnded();
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
          callEnded();
      }
  });
}

const StepFour: React.FC<any> = (props) => {
  const global: any = window;
  let call: any = null;
  const [stringeeClient] = useState<any>(new global.StringeeClient());
  // const [isRingRing, setIsRingRing] = useState<boolean>(true);
  const remoteVideo = useRef(null);
  const localVideo = useRef(null);
  const [stateAuthentication] = useAuthentication();
  // const history = useHistory();
  // // const location = useLocation();
  // const [, actionStepper] = useStepperStore();
  // const nextToStep = () => {
  //   history.push(RoutesString.StepTwoTwo);
  //   actionStepper.setCurrentPathStep(RoutesString.StepTwoTwo);
  // };

  useEffect(() => {
    const initVideoCall = async function () {
      const response = await getAccessToken(stateAuthentication);
      const accessToken = get(response, 'body.accessToken', '');
      settingClientEvents(stringeeClient, call, remoteVideo, localVideo);
      stringeeClient?.connect(accessToken);
    }
    initVideoCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeCall = (videocall) => {
    call = new global.StringeeCall2(stringeeClient, 'FROM_YOUR_NUMBER', 'user_2', videocall);
    settingCallEvent(call, remoteVideo, localVideo);

    call.makeCall(function (res) {
        console.log('make call callback: ' + JSON.stringify(res));
    });
}

  return (
    <div className="container">
      <div className="d-flex justify-content-center mb-5">Chúc mừng quý khách đã xác thực thành công</div>

      <div>
      <Button
        className="next-button"
        variant="contained"
        color="primary"
        onClick={() => makeCall(true)}
      >
        Tiếp tục
      </Button>
        <video ref={remoteVideo} playsInline autoPlay muted style={{ width: 350, height: 350, backgroundColor: 'black' }}></video>
        <video ref={localVideo} playsInline autoPlay style={{ width: 350, height: 350, backgroundColor: 'black' }}></video>
      </div>
    </div>
  );
};

export default withRouter(StepFour);
