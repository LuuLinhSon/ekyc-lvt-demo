import React from 'react';
import SHAHID_LOGO from './../../assets/images/logo-dark.svg';

const Welcome: React.FC = () => {
  return (
    <div className="my-5 welcome-page">
      <div className="mb-5 text-center">
        <img src={SHAHID_LOGO} alt="SHAHID_LOGO_ALT" className="welcome-page-logo" />
      </div>
      <div className="text-center welcome-page-text">
        <span>Welcome</span>
      </div>
    </div>
  );
};

export default Welcome;
