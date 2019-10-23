import Vue from 'vue'
import {Message} from "element-ui";
import Router from 'vue-router'
import layout from '@/views/layout.vue'
import layoutNo from '@/views/layoutNo.vue'
import ModifyPassword from '@/views/common/ModifyPassword';
import OidcCallback from '@/views/oidc/callback.vue';
import OidcCallbackError from '@/views/oidc/callbackError.vue';

Vue.component(Message);
Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [

        // 改密码
        {
            name: 'modifypassword',
            path: '/mpassword',
            component: ModifyPassword
        },

        {
            name: "sub",
            path: "/sub",
            component: layoutNo,
            children: [
                //--供应商任务列表
                {
                    name: "distributor",
                    path: "/sub/distributor",
                    props: true,
                    meta: {requiresAuth: true, role: ["供应商执行员"]},
                    component: () => import('@/views/distributor/index'),
                },

                // --客户端维护效果类别
                {
                    name: "client",
                    path: "/sub/client",
                    meta: {requiresAuth: true, role: ["客户"]},
                    component: () => import('@/views/client/index'),
                },
                // 查看撰写
                {
                    name: "view-redirect",
                    path: "/sub/:dir/:id?/:what?",
                    meta: {role: ["客户", "维护员", "管理员", "超级管理员", "供应商执行员"]},
                    redirect: to => {
                        let nextName = "";
                        switch (to.params.dir) {

                            case "1":
                            case "view-write":
                                nextName = "view-write";
                                break;
                            case "2":
                            case "view-publish":
                                nextName = "view-publish";
                                break;
                            case "3":
                            case "view-like":
                                nextName = "view-like";
                                break;
                            case "4":
                            case "view-reverse":
                                nextName = "view-reverse";
                                break;
                        }
                        return {
                            name: nextName,
                        }
                    }
                },
                {
                    name: "view-write",
                    path: "/sub/view-write/:id?/:what?",
                    props: true,
                    meta: {role: ["客户", "维护员", "管理员", "超级管理员", "供应商执行员"]},
                    component: () => import('@/views/maintain/view/write'),
                },
                // 查看发布
                {
                    name: "view-publish",
                    path: "/sub/view-publish/:id?/:what?",
                    props: true,
                    meta: {role: ["客户", "维护员", "管理员", "超级管理员", "供应商执行员"]},
                    component: () => import('@/views/maintain/view/publish'),
                },
                // 查看点赞
                {
                    name: "view-like",
                    path: "/sub/view-like/:id?/:what?",
                    props: true,
                    meta: {role: ["客户", "维护员", "管理员", "超级管理员", "供应商执行员"]},
                    component: () => import('@/views/maintain/view/like'),
                },
                // 查看反向
                {
                    name: "view-reverse",
                    path: "/sub/view-reverse/:id?/:what?",
                    props: true,
                    meta: {role: ["客户", "维护员", "管理员", "超级管理员", "供应商执行员"]},
                    component: () => import('@/views/maintain/view/reverse'),
                },
            ]
        },

        // 页面布局
        {
            path: '/',
            name: 'layout',
            component: layout,
            redirect: "/maintain-list",
            children: [
                // 创建采集维护
                {
                    name: "create-maintain",
                    path: "/create-maintain/:projectid/:newsid?",
                    props: true,
                    meta: {requiresAuth: true, role: ["维护员", "管理员", "超级管理员"]},
                    component: () => import('@/views/maintain/create/maintain'),
                },
                // 维护列表
                {
                    name: "maintain-list",
                    path: "/maintain-list",
                    props: true,
                    meta: {requiresAuth: true, role: ["维护员", "管理员", "超级管理员"]},
                    component: () => import('@/views/maintain/index'),
                },
                // 维护统计报告
                {
                    name: "maintain-report",
                    path: "/maintain-report",
                    meta: {
                        requiresAuth: true,
                        role: ["客户", "维护员", "维护员", "管理员", "超级管理员"]
                    },
                    component: () => import('@/views/maintain/report'),
                },
                // 创建撰写
                {
                    name: "create-write",
                    path: "/create-write/:id?/:projectID?",
                    props: true,
                    meta: {
                        requiresAuth: true,
                        role: ["维护员", "管理员", "超级管理员"]
                    },
                    component: () => import('@/views/maintain/create/write'),
                },
                // 创建发布
                {
                    name: "create-publish",
                    path: "/create-publish/:id?/:projectID?",
                    props: true,
                    meta: {
                        requiresAuth: true,
                        role: ["维护员", "管理员", "超级管理员"]
                    },
                    component: () => import('@/views/maintain/create/publish'),
                },
                // 创建点赞
                {
                    name: "create-like",
                    path: "/create-like/:id?/:projectID?",
                    props: true,
                    meta: {
                        requiresAuth: true,
                        role: ["维护员", "管理员", "超级管理员"]
                    },
                    component: () => import('@/views/maintain/create/like'),
                },
                // 创建反向
                {
                    name: "create-reverse",
                    path: "/create-reverse/:id?/:projectID?",
                    props: true,
                    meta: {
                        requiresAuth: true,
                        role: ["维护员", "管理员", "超级管理员"]
                    },
                    component: () => import('@/views/maintain/create/reverse'),
                },


                //--新闻列表
                {
                    name: "recommend",
                    path: "/recommend",
                    meta: {
                        requiresAuth: true,
                        role: ["维护员", "管理员", "超级管理员"]
                    },
                    component: () => import('@/views/recommend/index'),
                },
                //--项目管理
                {
                    name: "project",
                    path: "/project",
                    meta: {
                        requiresAuth: true,
                        role: ["超级管理员"]
                    },
                    component: () => import('@/views/project/index'),
                },
                //--创建项目
                {
                    name: "create-project",
                    path: "/create-project/:id?",
                    props: true,
                    meta: {
                        requiresAuth: true,
                        role: ["超级管理员"]
                    },
                    component: () => import('@/views/project/create'),
                },
                //--供应商管理
                {
                    name: "distributor-manage",
                    path: "/distributor-manage",
                    meta: {
                        requiresAuth: true,
                        role: ["超级管理员"]
                    },
                    component: () => import('@/views/distributor-manage/index'),
                },

                // 用户管理
                {
                    name: "account-list",
                    path: "/account-list",
                    meta: {
                        requiresAuth: true,
                        role: ["超级管理员"]
                    },
                    component: () => import('@/views/account/index'),
                },
            ]
        },
        {
            path: '/callback',
            name: 'oidcCallback',
            component: OidcCallback,
            meta: {
                isPublic: true,
                role: ["客户", "维护员", "供应商执行员", "管理员", "超级管理员"]
            }
        },
        {
            path: '/callback-error',
            name: 'oidcCallbackError',
            component: OidcCallbackError,
            meta: {
                isPublic: true,
                role: ["客户", "维护员", "供应商执行员", "管理员", "超级管理员"]
            }
        },
        // catch all redirect
        // {path: '*', redirect: '/'}

    ]
})
