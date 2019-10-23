import router from './router';
import store from './store/index';
import {Message} from 'element-ui'
// import {getToken} from '@/utils/auth';

const whiteList = [];

router.beforeEach((to, from, next) => {
    store.dispatch("oidcCheckAccess", to).then((hasAccess) => {
        if (hasAccess) {
            // 有 token 但没有用户角色信息 判断当前用户是否已拉取完用户信息
            // if (store.getters.roleName.length === 0) {
            //     store.dispatch('GetUserInfo').then(() => {
            //         next({...to, replace: true});
            //     }).catch((err) => {
            //         Message.info("访问路由出错");
            //         next({path: "/"});
            //     })
            // } else {
            //     // 没有动态改变权限的需求可直接next() 删除下方权限判断
            //     if ((to.meta.role === "管理员" && store.getters.roleName === "管理员") || _.isNil(to.meta.role)) {
            //         next();
            //     } else {
            //         Message.info("无权访问");
            //         next({path: "/"});
            //     }
            //
            //     // next({path: '/401', replace: true, query: {noGoBack: true}})
            // }
            next();
        } else {

            // 否则全部重定向到登录页
            Message.error("未授权访问此页面")

        }
    });


});
