import React from "react";
import LoaderGif from "../../assets/images/loading.gif";

import { useSelector } from "react-redux";

const LoadingIndicator = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  return isLoading ? (
    <div className="loader-container">
      <div className="loader">
        <img src={LoaderGif} alt="loading"/>
      </div>
    </div>
  ) : null;
};

export default LoadingIndicator;
