import React, { useContext, useState, useEffect } from "react";
import styles from "./editUserInfo.less";
import {
  PageHeader,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  Avatar,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import globalStoreState from "@/stores";
import { post } from "@/api";

interface User {
  name?: string;
  headerimg?: string;
  email?: string;
  openid?: string;
  id?: string;
  nickname?: string;
}

const UserEdit = () => {
  const state = useContext(globalStoreState);
  const [editPwdModalVisiable, dispatchEditPwdModalVisiable] = useState(false);
  const [editEmailModalVisiable, dispatchEditEmailModalVisiable] = useState(
    false
  );

  const [disable, dispatchDisable] = useState(false);
  const [info, dispatchInfo] = useState<User>({});

  const [pwdForm] = Form.useForm();
  const [emailForm] = Form.useForm();

  const editPassword = () => {
    dispatchEditPwdModalVisiable(true);
  };

  const editEmailAddress = () => {
    dispatchEditEmailModalVisiable(true);
  };

  const handleEditPwdSubmit = (values: any) => {
    post("/v1/user/editpwd", {
      oldPassword: pwdForm.getFieldValue("oldpassword"),
      newPassword: pwdForm.getFieldValue("newpassword"),
      checkPassword: pwdForm.getFieldValue("checkpassword"),
      id: state.state.userInfo.openid
        ? state.state.userInfo.openid
        : "0aea2df0-6334-11ea-90a2-a9cb8e8cf906",
    }).then((res) => {
      if (res.data.code === 0) {
        message.success(res.data.message);
        dispatchEditPwdModalVisiable(false);
      } else {
        message.error(res.data.message);
      }
    });
  };
  const handleEditEmailSubmit = (values: any) => {
    post("/v1/user/editemail", {
      email: emailForm.getFieldValue("email"),
      verifyCode: emailForm.getFieldValue("vertify"),
      id: state.state.userInfo.id
        ? state.state.userInfo.id
        : "0aea2df0-6334-11ea-90a2-a9cb8e8cf906",
    }).then((res) => {
      if (res.data.code !== 0) {
        message.error(res.data.message);
      } else {
        message.success(res.data.message);
        dispatchEditEmailModalVisiable(false);
      }
    });
  };

  const sendCode = () => {
    dispatchDisable(true);
  };

  useEffect(() => {
    if (disable) {
      const email = emailForm.getFieldValue("email");
      post("/v1/user/sendcode", {
        email,
        id: state.state.userInfo.id
          ? state.state.userInfo.id
          : "0aea2df0-6334-11ea-90a2-a9cb8e8cf906",
      }).then((res) => {
        if (res.data.code === 0) {
          message.success("验证码发送成功");
        } else {
          message.error(res.data.message);
        }
      });
    }
  }, [disable]);

  const handleEmailCancel = () => {
    dispatchEditEmailModalVisiable(false);
  };

  const handlePwdCancel = () => {
    dispatchEditPwdModalVisiable(false);
  };

  const getUserInfo = () => {
    post("/v1/user/getuserinfo", {
      id: state.state.userInfo.id
        ? state.state.userInfo.id
        : "0aea2df0-6334-11ea-90a2-a9cb8e8cf906",
    }).then((res) => {
      if (res.data.code !== 0) {
        message.error(res.data.message);
      } else {
        dispatchInfo(res.data.data[0]);
      }
    });
  };

  useEffect(() => {
    getUserInfo();
  }, [editEmailModalVisiable, editPwdModalVisiable]);

  return (
    <div className={styles.editUserInfo}>
      <PageHeader title="个人信息设置" className={styles.header} />
      <Descriptions
        className={styles.detail}
        title={info ? info.nickname : "-"}
        column={3}
      >
        <Descriptions.Item label="账号" span={3}>
          {info
            ? info.name
            : state.state.userInfo.name
            ? state.state.userInfo.name
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="头像" span={3}>
          {info ? (
            <Avatar size={32} src={info.headerimg} />
          ) : (
            <Avatar size={32} icon={<UserOutlined />} />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="密码" span={3}>
          <span>*</span>

          <Button
            type="primary"
            className={styles.operatorBtn}
            onClick={editPassword}
          >
            修改密码
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="邮箱" span={3}>
          <span>{info ? info.email : "-"}</span>
          <Button
            type="primary"
            className={styles.operatorBtn}
            onClick={editEmailAddress}
          >
            绑定邮箱
          </Button>
        </Descriptions.Item>
      </Descriptions>

      <Modal
        title="修改密码"
        cancelText="取消"
        okText="提交"
        visible={editPwdModalVisiable}
        centered={true}
        bodyStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onCancel={handlePwdCancel}
        onOk={handleEditPwdSubmit}
        destroyOnClose={true}
      >
        <Form form={pwdForm} style={{ width: "80%" }}>
          <Form.Item
            name="oldpassword"
            label="旧密码"
            rules={[{ required: true, message: "请输入旧密码!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="newpassword"
            label="新密码"
            rules={[{ required: true, message: "请输入新密码!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="checkpassword"
            label="确认密码"
            rules={[{ required: true, message: "请再次输入新密码!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改邮箱"
        cancelText="取消"
        okText="提交"
        visible={editEmailModalVisiable}
        centered={true}
        bodyStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onCancel={handleEmailCancel}
        onOk={handleEditEmailSubmit}
        destroyOnClose={true}
      >
        <Form form={emailForm} style={{ width: "80%" }}>
          <Form.Item
            name="oldpassword"
            label="当前邮箱"
            rules={[{ required: true, message: "请输入旧密码!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            name="email"
            label="新邮箱"
            rules={[
              { required: true, type: "email", message: "请输入邮箱地址!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vertify"
            label="验证码"
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Input />
              <Button type="primary" onClick={sendCode} disabled={disable}>
                发送验证码
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserEdit;
