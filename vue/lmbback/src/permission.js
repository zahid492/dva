import router from './router';
import store from './store/index';
import {Message} from 'element-ui'

router.beforeEach((to, from, next) => {


    store.dispatch("oidcCheckAccess", to).then((hasAccess) => {
        if (hasAccess) {

            next();
        } else {
            // 否则全部重定向到登录页
            Message.error("未授权访问此页面")
        }
    });


});
