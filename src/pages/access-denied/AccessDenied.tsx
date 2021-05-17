import React from 'react';
import { Link } from 'react-router-dom';
import './AccessDenied.scss';

const AccessDenied: React.FC = () => {
  return (
    <>
      <div className="my-5 access-denied">
        <div className="mb-4 text-center">
          <i className="fa fa-close fa-3x text-danger" />
        </div>
        <h5 className="text-center mb-4">403 Access Denied</h5>
        <div className="text-center">
          <Link to="/" className="text-decoration-none">
            <i className="fa fa-angle-left mr-2" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AccessDenied;
