import React, { useEffect } from 'react';
import './CallVideo.scss';
import { Col } from 'reactstrap';

import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import UserInfoFormCall from './UserInfoForm';
import { get } from 'lodash';

const CallVideo: React.FC<any> = ({ remoteVideo, localVideo, dataFromServer, rejectCall, nextStep, action }) => {
  const ocrBackImageUrl = get(dataFromServer, 'ocrBackImageUrl', '');
  const ocrFrontImageUrl = get(dataFromServer, 'ocrFrontImageUrl', '');
  const faceImageUrls = get(dataFromServer, 'faceImageUrls', []);
  useEffect(() => {
    if(action === 'APPROVE' || action === 'REJECT' || action === 'ENDED') return nextStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  return (
    <div className="container">
      <div className="call-container">
        <Col md={5} sm={5}>
          <>
          <div className="col-video">
            <video className="remote-video" ref={remoteVideo} playsInline autoPlay muted style={{ width: '100%', height: '100%', backgroundColor: 'black' }}></video>
            <video className="local-video" ref={localVideo} playsInline autoPlay style={{ width: 120, height: 130, backgroundColor: 'black' }}></video>
          </div>
          <span className="image-text">ẢNH GIẤY TỜ TÙY THÂN</span>
          <div className="image-orc">
            <img src={ocrFrontImageUrl} className="d-block w-50 pr-2" alt="LOGO_ALT" height="140" />
            <img src={ocrBackImageUrl} className="d-block w-50 pr-2" alt="LOGO_ALT" height="140" />
          </div>
          <span className="image-text">ẢNH KHUÔN MẶT</span>
          <div className="image-orc">
            <img src={faceImageUrls[0]} className="d-block w-50 pr-2" alt="LOGO_ALT" height="150" />
            <img src={faceImageUrls[1]} className="d-block w-50 pr-2" alt="LOGO_ALT" height="150" />
          </div>
          </>
        </Col>
        <Col md={7} sm={7}>
          <div className="col-info">
            <UserInfoFormCall dataFromServer={dataFromServer}/>
          </div>
        </Col>
      </div>
      <div className="wrapper-button">
          <Button className="action-button" variant="contained" color="primary" onClick={rejectCall}>
            Kết thúc
          </Button>
          <Button className="action-button" variant="contained" color="primary" disabled={true}>
            Tiếp tục
          </Button>
        </div>  
    </div>
  );
};

export default withRouter(CallVideo);
