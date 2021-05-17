import React from 'react';
import { Spinner as BootstrapSpinner } from 'reactstrap';
import './Spinner.scss';

const Spinner: React.FC = () => {
  return (
    <div className="spinner-loading-wrapper">
      <BootstrapSpinner color="primary" />
    </div>
  );
};

export default Spinner;
