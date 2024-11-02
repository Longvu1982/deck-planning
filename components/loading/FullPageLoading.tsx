import React from "react";
import "./FullPageLoading.css";

const FullPageLoading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="loader">
        <div className="cyan"></div>
        <div className="blue"></div>
        <div className="green"></div>
        <div className="red"></div>
      </div>
    </div>
  );
};

export default FullPageLoading;
