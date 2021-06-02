import React from 'react';
import './LoadingBar.scss';

const LoadingBar: React.FC = ({ children }) => {
  return (
    <div className="loading-bar-container">
      <div className="progress-line" />
      {children && <span className="progress-text">{children}</span>}
    </div>
  );
};

export default LoadingBar;
