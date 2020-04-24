import React, { useContext } from "react";
import { Row, Col, Form, Input, Button, message } from "antd";
import {LockOutlined,UserOutlined} from '@ant-design/icons'
import styles from "./index.less";
import { post } from "@/api";
import globalStoreState from "@/stores/index";
import { useHistory } from "react-router-dom";


const Login = () => {
  const history = useHistory();
  const state = useContext(globalStoreState);
  const [form] = Form.useForm();


  const handleSubmit = (values: any) => {
    post("/v1/login/login", values).then(res => {
      if (res.data.code !== 0) {
        message.error(res.data.message);
      } else {
        state.dispatch({
          type: "login",
          value: res.data.data
        });
        history.push("/");
      }
    });
  };

  return (
      <div className={styles.loginPage}>
        <Row
            justify="start"
            align="middle"
            className={styles.loginPage}
        >
          <Col span={8} offset={8} className={styles.loginCol}>
            <div className={styles.loginTitle}>
              <span>登录平台</span>
            </div>
            <Form form={form} style={{ width: "80%" }} onFinish={handleSubmit}>
              <Form.Item name='username' rules={ [{required: true, message: "请输入用户名!" }]}>
                <Input
                    prefix={
                      <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="用户名"
                />
              </Form.Item>
              <Form.Item  name='password' rules={[{ required: true, message: "请输入密码!" }]}>
                <Input
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    placeholder="密码"
                />
              </Form.Item>
              <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.loginButton}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
  );
};

export default Login;
