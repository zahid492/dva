import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import OidcCallback from '@/views/oidc/callback.vue';
import OidcCallbackError from '@/views/oidc/callbackError.vue';
import SilentRenew from '@/views/oidc/silentRenew.vue';
import Logout from '@/views/oidc/logout.vue';

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            redirect: "/mymedia-platforms",
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    name: "mymedia-platforms",
                    path: "/mymedia-platforms",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/mymedia/platforms'),
                },
                {
                    name: "mymedia-accounts",
                    path: "/mymedia-accounts",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/mymedia/accounts'),
                },
                {
                    name: "mymedia-articles",
                    path: "/mymedia-articles",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/mymedia/articles'),
                },

                // 对应关系
                {
                    name: "relation-article",
                    path: "/relation-article",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/relation/article'),
                },
                {
                    name: "relation-publish",
                    path: "/relation-publish",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/relation/publish'),
                },

                // 统计分析

                {
                    name: "statistic-account",
                    path: "/statistic-account",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/statistic/account'),
                },
                {
                    name: "statistic-ac",
                    path: "/statistic-ac",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/statistic/account-day'),
                },
                {
                    name: "statistic-platform",
                    path: "/statistic-platform",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/statistic/platform'),
                },

                // 日志
                {
                    name: "logs-log",
                    path: "/logs-log",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/logs/log'),
                },
                {
                    name: "logs-monitor",
                    path: "/logs-monitor",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/logs/monitor'),
                },

                // 监控
                {
                    name: "monitor-basic",
                    path: "/monitor-basic",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/monitor/basic'),
                },


                // 热文管理

                {
                    name: "hot-newsource",
                    path: "/hot-newsource",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/hot/newsource'),
                },

                {
                    name: "hot-tpl",
                    path: "/hot-tpl",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/hot/template'),
                },

                {
                    name: "hot-frame",
                    path: "/hot-frame",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/hot/frame'),
                },

                {
                    name: "hot-module",
                    path: "/hot-module",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/hot/module'),
                },
                {
                    name: "hot-division",
                    path: "/hot-division",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/hot/division'),
                },
                {
                    name: "hot-tpllang",
                    path: "/hot-tpllang",
                    meta: {
                        requiresAuth: true,
                    },
                    component: () => import('@/views/hot/tplLang'),
                },


            ],
        },
        {
            path: '/callback',
            name: 'oidcCallback',
            component: OidcCallback,
            meta: {
                isPublic: true,
            }

        },
        {
            path: '/callback-error',
            name: 'oidcCallbackError',
            component: OidcCallbackError,
            meta: {
                isPublic: true,
            }
        },
        {
            path: '/silent-renew',
            name: 'silentRenew',
            component: SilentRenew,
            meta: {
                isPublic: true,
            }

        },

        {
            path: '/logout',
            name: 'logout',
            component: Logout,
            meta: {
                isPublic: true,
            }
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/Test/Test'),
            meta: {
                isPublic: true,
            }
        }
    ]
})
