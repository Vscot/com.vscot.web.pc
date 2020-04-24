export interface SelfRoute {
  path: string;
  name: string;
  exact: boolean;
  component: any;
  auth: boolean;
  children?: any[];
}

import Login from "@/pages/login";
import Home from "@/pages/home";
import MainLayout from "@/layouts/mainLayout";
import DashBoard from "@/pages/home/dashboard";
import RoomIndex from "@/pages/room/index";
import SingleBarrage from "@/pages/barrage/singleBarrage";
import MultiBarrage from "@/pages/barrage/multiBarrage";
import UserEdit from "@/pages/user/editUserInfo";
import RoomDetail from "@/pages/room/roomDetail";
import NotFound from "@/pages/error/404";

export const routeList = [
  {
    path: "/login",
    name: "login",
    exact: true,
    auth: false,
    component: Login
  },
  {
    path: "/singlebarrage",
    name: "singlebarrage",
    exact: true,
    auth: true,
    component: SingleBarrage
  },
  {
    path: "/multibarrage/:id",
    name: "multibarrage",
    exact: true,
    auth: true,
    component: MultiBarrage
  },
  {
    path: "/404",
    name: "notfound",
    exact: true,
    auth: false,
    component: NotFound
  },
  {
    path: "/",
    name: "home",
    exact: false,
    auth: false,
    component: MainLayout,
    children: [
      {
        path: "/",
        exact: true,
        auth: true,
        name: "dashboard",
        component: DashBoard
      },
      {
        path: "/room",
        exact: true,
        name: "roomindex",
        auth: true,
        component: RoomIndex
      },
      {
        path: "/edituserinfo",
        exact: true,
        name: "edituser",
        auth: true,
        component: UserEdit
      },
      {
        path: "/roomdetail/:id",
        exact: true,
        name: "roomdetail",
        auth: true,
        component: RoomDetail
      }
    ]
  }
];
