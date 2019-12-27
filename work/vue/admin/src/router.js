import Vue from 'vue';
import {Message} from 'element-ui';
import Router from 'vue-router';
import Home from './views/Home.vue';
import OidcCallback from '@/views/oidc/callback.vue';
import SilentRenew from '@/views/oidc/silentRenew.vue';
import OidcCallbackError from '@/views/oidc/callbackError.vue';
import Logout from '@/views/common/Logout.vue';

Vue.component(Message);
Vue.use(Router);

// role 管理员: 管理员; 人力资源: 人力资源; 研发工程师: 研发工程师
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        // 首页
        {
            path: '/',
            name: 'home',
            component: Home,
            redirect: "/app",
            meta: {
                requiresAuth: true,
                role:["管理员","研发工程师"]
            },
            children: [
                // 我的应用
                {
                    path: '/app',
                    name: 'app',
                    component: () => import('@/views/app/index'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员","研发工程师"]
                    }
                },
                // 应用客户端管理
                {
                    path: '/app/client/:id',
                    name: 'appclient',
                    props: true,
                    component: () => import('@/views/app/appClient'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员","研发工程师"]
                    }
                },
                // 角色管理
                {
                    path: '/app/role/:id',
                    name: 'role',
                    props: true,
                    component: () => import('@/views/app/role'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员","研发工程师"]
                    }
                },
                // 规则管理
                {
                    path: '/app/rule/:id',
                    name: 'rule',
                    props: true,
                    component: () => import('@/views/app/rule'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员","研发工程师"]
                    }
                },
                // api资源管理
                {
                    path: '/resource',
                    name: 'resource',
                    component: () => import('@/views/resource/index'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员","研发工程师"]
                    }
                },
                // api资源创建编辑
                {
                    path: '/resedit/:id?',
                    name: 'resedit',
                    props: true,
                    component: () => import('@/views/resource/edit'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员","研发工程师"]
                    }
                },

                // 客户端管理
                {
                    path: '/client',
                    name: 'client',
                    component: () => import('@/views/client/index'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员","研发工程师"]
                    }
                },

                // 用户管理
                {
                    path: '/account',
                    name: 'account',
                    component: () => import('@/views/account/index'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员", "人力资源"]
                    }
                },
                // 修改密码
                {
                    path: '/mpassword',
                    name: 'modifypassword',
                    component: ()=> import('@/views/common/Modifypassword'),
                    meta: {
                        requiresAuth: true,
                        role:["管理员", "人力资源", "研发工程师", "游客"]
                    }
                },

            ]
        },
        {
            path: '/callback',
            name: 'oidcCallback',
            component: OidcCallback,
            meta: {
                isPublic: true,
                role:["管理员", "人力资源", "研发工程师", "游客"]
            }
        },
        {
            path: '/callback-error',
            name: 'oidcCallbackError',
            component: OidcCallbackError,
            meta: {
                isPublic: true,
                role:["管理员", "人力资源", "研发工程师", "游客"]
            }
        },
        {
            path: '/silent-renew',
            name: 'silentRenew',
            component: SilentRenew,
            meta: {
                isPublic: true,
                role:["管理员", "人力资源", "研发工程师", "游客"]
            }
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout,
            meta: {
                isPublic: true,
                role:["管理员", "人力资源", "研发工程师", "游客"]
            }
        },
    ]
})
