import React, { useEffect } from "react";

const Alert = ({ type, msg, removeAlert, lists }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [lists]);
  return <p className={`alert alert-${type}`}>{msg}</p>;
};

export default Alert;
