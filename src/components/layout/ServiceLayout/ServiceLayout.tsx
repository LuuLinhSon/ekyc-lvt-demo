import React from 'react';
import LVT_LOGO from 'assets/images/lvt-img.png';

import './ServiceLayout.scss';

const ServiceLayout: React.FC = ({ children }) => {
  return (
    <div className="full-screen">
      <div className="mb-4 d-flex justify-content-center mt-5">
        <img src={LVT_LOGO} className="d-block" alt="LOGO_ALT" height="50" />
      </div>
      <div className="service-layout">{children}</div>
    </div>
  );
};

export default ServiceLayout;
