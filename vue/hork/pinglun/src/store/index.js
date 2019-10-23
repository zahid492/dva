import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate';
import omgr from "./modules/oidc";
import user from "./modules/user";
import accounts from "./modules/accounts";
import suppliers from "./modules/suppliers";
import suptasks from "./modules/suppliers-task";
import projects from "./modules/projects";
import maintains from "./modules/maintains";
import news from "./modules/news";

import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules:{
        omgr,
        user,
        accounts,
        projects,
        suppliers,
        suptasks,
        maintains,
        news
    },
    getters,
    // plugins: [createPersistedState({
    //     key:"pluser",
    //     paths:["user", "accounts", "maintains"]
    // })],
})
