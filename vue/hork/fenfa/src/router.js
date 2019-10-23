import Vue from 'vue'
import VueRouter  from 'vue-router'
import Home from './views/Home.vue'
import Start from './views/Start.vue'

Vue.use(VueRouter );

export default new VueRouter ({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        //引导页
        {
            name: 'start',
            path: '/',
            component: Start
        },
        // 首页
        {
            path: '/home',
            name: 'home',
            component: Home
        },

        // 句子对
        {
            path: '/juzi/:rid',
            props: true,
            name: 'juzi',
            component: () => import(/* webpackChunkName: "Juzi" */ './views/Juzi.vue')
        },
        // 句子对改写
        {
            path: '/gaixie/:rid',
            props: true,
            name: 'gaixie',
            component: () => import(/* webpackChunkName: "Gaixie" */ './views/Gaixie.vue')
        },
        // 同义词
        {
            path: '/tongyi/:rid',
            props: true,
            name: 'tongyi',
            component: () => import(/* webpackChunkName: "Tongyi" */ './views/Tongyi.vue')
        },
        // 评价
        {
            path: '/pingjia/:rid',
            name: 'pingjia',
            props: true,
            component: () => import(/* webpackChunkName: "pingjia" */ './views/Pingjia.vue')
        },
        // 审核任务
        {
            path: '/shenhe/:rid',
            props: true,
            name: 'shenhe',
            component: () => import(/* webpackChunkName: "Shenhe" */ './views/Shenhe.vue')
        },
        // 个人中心
        {
            path: '/my',
            name: 'my',
            component: () => import(/* webpackChunkName: "My" */ './views/My/index.vue'),
        },
        {
            path: '/wan/:tid',
            props: true,
            name: 'wan',
            component: () => import('./views/My/Wan.vue')
        },
        {
            path: '/want/:tid',
            props: true,
            name: 'want',
            component: () => import('./views/My/WanT.vue')
        },

        { path: '*', redirect: '/' }

    ]
});
