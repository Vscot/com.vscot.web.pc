import React, { useState, useContext } from "react";
import { Layout, Menu, message } from "antd";
import {
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import _ from "lodash";
import { ClickParam } from "antd/lib/menu";
import styles from "./mainLayout.less";
import logo from "@/assets/image/logo.jpg";
import globalStoreState from "@/stores/index";
import { post } from "@/api";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface Iprops {
  children: any;
}

const MainLayout = (props: Iprops) => {
  const history = useHistory();
  const location = useLocation();
  const state = useContext(globalStoreState);

  const [collapsed, dispatchCollapsed] = useState<boolean>(false);
  const [selectedKey, dispatchSelectedKey] = useState<string[]>(["1"]);

  const onCollapse = (collapsed: boolean) => {
    dispatchCollapsed(collapsed);
  };

  const onClick = (params: ClickParam) => {
    dispatchSelectedKey(params.keyPath);
    history.push(params.key);
  };

  const layout = () => {
    post("/v1/login/layout", {
      id: state.state.userInfo.id
    }).then(res => {
      if (res.data.code !== 0) {
        message.error(res.data.message);
      } else {
        state.dispatch({
          type: "layout",
          value: {
            isLogin: false,
            token: ""
          }
        });
      }
    });
  };

  return (
    <div className={styles.mainLayout}>
      <Layout style={{ height: "100%" }}>
        <Header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="" />
          </div>
          <Menu theme="dark" mode="horizontal" className={styles.headerMenu}>
            <Menu.Item key="user">{state.state.userInfo.nickname}</Menu.Item>
            <Menu.Item key="layout" onClick={layout}>
              退出登录
            </Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="logo" />
            <Menu
              theme="dark"
              defaultSelectedKeys={selectedKey}
              mode="inline"
              onClick={onClick}
            >
              <Menu.Item key="/">
                <PieChartOutlined />
                <span>仪表板</span>
              </Menu.Item>
              <Menu.Item key="/room">
                <DesktopOutlined />
                <span>房间管理</span>
              </Menu.Item>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <TeamOutlined />
                    <span>个人信息</span>
                  </span>
                }
              >
                <Menu.Item key="/edituserinfo">修改个人信息</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: "0 16px" }}>{props.children}</Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
