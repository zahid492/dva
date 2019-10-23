import Vue from 'vue'
import Router from 'vue-router'
import Mb from './views/Mb.vue'

Vue.use(Router);

export default new Router({
    mode: "hash",
    routes: [
        {
            path:"/",
            redirect: "/mb"
        },
        {
            path: '/mb*',
            name: 'mb',
            component: Mb,
        }
    ]
})
