import router from './router';
import store from './store/index';
import {Message} from 'element-ui'
// const whiteList = ['/login'];

router.beforeEach((to, from, next) => {
    store.dispatch("oidcCheckAccess", to).then((hasAccess) => {
        console.log("hasAccess", hasAccess)
        if (hasAccess) {
            //
            // if (_.includes(to.meta.role, store.getters.user.role) || _.isNil(to.meta.role)) {
            //     next();
            // } else {
            //     Message.info("无权访问!");
            //     location.reload()
            // }

            next();

        } else {
            /* has no token*/
            // if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            //     next()
            // } else {
            //     next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
            // }
            Message.error("未授权访问此页面")
        }
    });

});
