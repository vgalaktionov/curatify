import axios from "axios";

import { thunk, Action, Thunk } from "easy-peasy";
import { User } from "../../types";

export interface UserModel {
  me?: User;
  ready: boolean;

  setUser: Action<UserModel, User>;
  setReady: Action<UserModel, boolean>;

  getUser: Thunk<UserModel>;
}

const userModel: UserModel = {
  me: null,
  ready: false,

  setUser(state, user) {
    state.me = user;
  },

  setReady(state, ready) {
    state.ready = ready;
  },

  getUser: thunk(async actions => {
    const { data: user } = await axios.get("/auth/me");
    if (user) {
      actions.setUser(user);
    }
  })
};

export default userModel;
