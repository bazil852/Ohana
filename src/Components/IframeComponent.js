import React from 'react';
import "./IframeComponent.css"

const IframeComponent = ({ src }) => {
  return (
    <div className="iframe-container">
      <iframe
        src={src}
        title="Embedded External Page"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  );
};

export default IframeComponent;
