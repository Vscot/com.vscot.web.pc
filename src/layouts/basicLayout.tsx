import React, { useContext } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { routeList, SelfRoute } from "@/routes";
import globalStoreState from "@/stores/index";
import { GlobalStore } from "@/stores/interface";
import NotFound from "@/pages/error/404";

const renderRouterMap = (router: SelfRoute[], state: GlobalStore) => {
  const route = router.map(item => {
    if (item.auth && (!state.state.isLogin || !state.state.token)) {
      return <Redirect to="/login" key="redirect" />;
    }
    const data = {
      exact: item.exact,
      path: item.path,
      key: item.name
    } as any;
    if (item.children && item.children.length !== 0) {
      data["render"] = () => {
        return (
          <item.component>
            {renderRouterMap(item.children as SelfRoute[], state)}
          </item.component>
        );
      };
      return <Route {...data}></Route>;
    }

    data["component"] = item.component;
    return <Route {...data}></Route>;
  });
  route.push(<Route component={NotFound} key="404notfound"></Route>);
  return <Switch>{route}</Switch>;
};

const BasicRouterLayout = () => {
  const state = useContext(globalStoreState);
  return <BrowserRouter>{renderRouterMap(routeList, state)}</BrowserRouter>;
};

export default BasicRouterLayout;
