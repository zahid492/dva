import Vue from 'vue'
import Vuex from 'vuex'
import user from "./modules/user";
import missions from "./modules/mission";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules:{
        user,
        missions
    },
    getters,
})
