import Vue from 'vue'
import Vuex from 'vuex'
// import user from "./modules/user";
import accounts from "./modules/accounts";
import missions from "./modules/missions";
import omgr from "./modules/oidc";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules:{
        // user,
        accounts,
        missions,
        omgr
    },
    getters,
})
