import { GlobalStoreState, Actions } from "../interface";

const globalReducer = (state: GlobalStoreState, action: Actions) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isLogin: true,
        userInfo: action.value,
        token: action.value.token
      };
    case "layout":
      return {
        ...state,
        isLogin: false,
        userInfo: {},
        token: ""
      };
    default:
      return state;
  }
};

export default globalReducer;
