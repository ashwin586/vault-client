import React from "react";

const PageLoader: React.FC = () => {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <div className="page-loader__spinner" />
      <span className="page-loader__text">Loading...</span>
    </div>
  );
};

export default PageLoader;
