import React from 'react';

const Loading = () => (
  <div>
    <div className="loading">
      <div className="loading-spinner" />
      <span className='sr-only' role="alert">Loading...</span>
    </div>
  </div>
);

export default Loading;