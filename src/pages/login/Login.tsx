import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SHAHID_LOGO from 'assets/images/logo-dark.svg';

const Login: React.FC<RouteComponentProps> = (props) => {
  return (
    <>
      <div className="mb-5">
        <div className="mb-4 d-flex justify-content-center">
          <img src={SHAHID_LOGO} className="d-block" alt="LOGO_ALT" height="30" />
        </div>
      </div>
      <div>Login</div>
    </>
  );
};

export default withRouter(Login);
