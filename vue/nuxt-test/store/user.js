import {
  getToken,
  setToken,
  getAccount,
  setAccount,
  removeToken,
  getName,
  setName,
  getRole,
  setRole,
  getId,
  setId
} from "@/utils/auth";

// 登录用户信息
export const state = () => ({
  id: getId(),
  account: getAccount(),
  name: getName(),
  token: getToken(),
  roleName: getRole(),
  statusName: ""
});

export const mutations = {
  SET_ID: function (state, id) {
    state.id = id
  },
  SET_TOKEN: function (state, token) {
    state.token = token
  },
  SET_STATUS: function (state, statusName) {
    state.statusName = statusName
  },
  SET_NAME: function (state, name) {
    state.name = name
  },
  SET_ACCOUNT: function (state, account) {
    state.account = account
  },
  SET_ROLE: function (state, roleName) {
    state.roleName = roleName
  }
};

export const actions = {
  // 登录
  async LoginByUsername({commit}, userInfo) {
    const tokenInfo = await this.$axios.$post('/User/Login', {
        account: userInfo.account,
        password: userInfo.password
      }
    );

    commit('SET_TOKEN', tokenInfo.data.token);
    commit('SET_ID', tokenInfo.data.id);
    commit('SET_ACCOUNT', userInfo.account);
    setToken(tokenInfo.data.token);
    setAccount(userInfo.account);
    setId(tokenInfo.data.id);
  },

  async GetUserInfo({commit}) {

    const res = await this.$axios.$get('/User/Info');

    let data = res.data;
    commit('SET_NAME', data.name);
    commit('SET_ROLE', data.roleName);

    setName(data.name);
    setRole(data.roleName);
  },

  async LoginOut({commit}) {
    try {
      await this.$axios.$get('/User/LoginOut');
      commit('SET_NAME', "");
      commit('SET_ROLE', "");

      setName("");
      setRole("");
      removeToken();
    } catch (err) {
      setName("");
      setRole("");
      removeToken();
    }
  }
};

export const getters = {
  token: state => state.token,
  account: state => state.account,
  name: state => state.name,
  roleName: state => state.roleName,
  statusName: state => state.statusName,
  user: state => state,
};




