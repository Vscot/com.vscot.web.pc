import React from "react";
import { Result } from "antd";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, this page is not existed."
      extra={<div></div>}
    ></Result>
  );
};

export default NotFound;
