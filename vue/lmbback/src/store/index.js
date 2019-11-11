import Vue from 'vue'
import Vuex from 'vuex'

import omgr from "./modules/oidc";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules:{
        omgr
    },
    getters,
})
