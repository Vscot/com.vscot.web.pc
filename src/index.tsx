import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import globalContext, { initGlobalState } from "./stores";
import { GlobalStoreState } from "./stores/interface";
import globalReducer from "./stores/reducers";
import BasicRouterLayout from "@/layouts/basicLayout";
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import {ConfigProvider} from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import "@/assets/css/index.less";

moment.locale('zh_cn');

const App = () => {
  const initState: GlobalStoreState = initGlobalState;
  const [state, dispatch] = useReducer(globalReducer, initState);
  return (
      <ConfigProvider locale={zh_CN}>
        <globalContext.Provider value={{ state, dispatch }}>
          <BasicRouterLayout />
        </globalContext.Provider>
      </ConfigProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
