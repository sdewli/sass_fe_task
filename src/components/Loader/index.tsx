import React from 'react';
import './Loader.scss';

export default function Loader() {
  return (
    <div className="main-loading-wrapper">
      <div className="align-items-center gap-3 justify-content-center d-flex loader-wrapper">
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
}
