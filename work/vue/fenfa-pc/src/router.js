import Vue from 'vue'
import VueRouter  from 'vue-router'
import Home from './views/Home.vue'
import Layout from './views/Layout/Layout.vue'
import Start from './views/Start.vue'

Vue.use(VueRouter );

export default new VueRouter ({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        //引导页
        {
            name: 'start',
            path: '/start',
            component: Start
        },
        // 首页
        {
            path: '/',
            name: 'layout',
            component: Layout,
            redirect:"/home",
            children:[
                {
                    path: '/home',
                    name: 'home',
                    component: Home,
                },
                // 审核
                {
                    path: '/shenhe/:rid',
                    props: true,
                    name: 'shenhe',
                    component: () => import(/* webpackChunkName: "Shenhe" */ './views/Mission/Shenhe.vue')
                },
                // 评价
                {
                    path: '/pingjia/:rid',
                    props: true,
                    name: 'pingjia',
                    component: () => import(/* webpackChunkName: "Pingjia" */ './views/Mission/Pingjia.vue')
                },

                // 句子对
                {
                    path: '/juzi/:rid',
                    props: true,
                    name: 'juzi',
                    component: () => import(/* webpackChunkName: "Juzi" */ './views/Mission/Juzi.vue')
                },

                // 句子对改写
                {
                    path: '/gaixie/:rid',
                    props: true,
                    name: 'gaixie',
                    component: () => import(/* webpackChunkName: "Gaixie" */ './views/Mission/Gaixie.vue')
                },

                // 同义词
                {
                    path: '/tongyi/:rid',
                    props: true,
                    name: 'tongyi',
                    component: () => import(/* webpackChunkName: "Tongyi" */ './views/Mission/Tongyi.vue')
                },
                // 个人中心
                {
                    path: '/my',
                    name: 'my',
                    component: () => import(/* webpackChunkName: "My" */ './views/My/index.vue'),
                },
                // 完成的任务列表
                {
                    path: '/wan/:tid',
                    props: true,
                    name: 'wan',
                    component: () => import('./views/My/Wan.vue')
                },

                // 句子对详情
                {
                    path: '/juzix/:jid',
                    props: true,
                    name: 'juzix',
                    component: () => import('./views/My/Juzix.vue')
                },
                // 句子对改写详情
                {
                    path: '/gaixiex/:jid',
                    props: true,
                    name: 'gaixiex',
                    component: () => import('./views/My/Gaixiex.vue')
                },

                // 同义词详情
                {
                    path: '/tongyix/:jid',
                    props: true,
                    name: 'tongyix',
                    component: () => import('./views/My/Tongyix.vue')
                },
                // 评价任务详情
                {
                    path: '/pingjiax/:jid',
                    props: true,
                    name: 'pingjiax',
                    component: () => import('./views/My/Pingjiax.vue')
                },
                // 审核任务详情
                {
                    path: '/shenhex/:jid',
                    props: true,
                    name: 'shenhex',
                    component: () => import('./views/My/Shenhex.vue')
                },

            ]
        },

        { path: '*', redirect: '/' }

    ]
});
