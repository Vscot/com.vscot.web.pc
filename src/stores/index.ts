import { createContext, Context, Dispatch, Reducer } from "react";
import {
  GlobalStore
} from "./interface";

export const initGlobalState = {
  isLogin: false,
  token: "",
  userInfo: {}
};

const globalStore: Context<GlobalStore> = createContext({} as GlobalStore);

export default globalStore;
