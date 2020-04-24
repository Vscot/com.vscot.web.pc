import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Spin, Modal } from "antd";
import styles from "./index.less";

interface Iprop extends RouteComponentProps {
  Visiable: boolean;
  Content: any;
}

const PageLoading = (props: Iprop) => {
  const { Visiable, Content } = props;
  return (
    <Modal
      className={styles.pageLoading}
      visible={Visiable}
      footer={null}
      closable={false}
      keyboard={false}
      centered={true}
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Spin size="large" {...props} spinning={Visiable} tip={Content} />
    </Modal>
  );
};

export default PageLoading;
