import { Dispatch, Reducer } from "react";
export interface Actions {
  type: string;
  value: any;
}

export interface GlobalStore {
  state: GlobalStoreState;
  dispatch: Dispatch<Actions>;
}

export interface GlobalStoreState {
  isLogin: boolean;
  token: string;
  userInfo: any;
}

export interface GlobalStoreProvider {
  reducer: Reducer<GlobalStoreState, Actions>;
  initState: GlobalStoreState;
}

