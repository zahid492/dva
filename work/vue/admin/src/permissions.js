import router from './router';
import store from './store/index';
import {Message} from 'element-ui';

router.beforeEach((to, from, next)=>{
    store.dispatch("oidcCheckAccess", to).then((hasAccess)=>{
        if(hasAccess){

            const requiresAuth = to.matched.some(record=> record.meta.requiresAuth);
            // console.log(to, to.matched)

            if(requiresAuth){
                let roleAuth = store.getters.oidcUser.role;

                // if(_.isString(roleAuth)){
                //     roleAuth = [roleAuth];
                // }
                // // console.log('roleAuth:', roleAuth)
                // if(_.intersection(to.meta.role, roleAuth).length>0){
                //     next();
                // }else{
                //     this.$message.warning("无权限访问")
                // }

            }

            next()

        }else{
            Message.error("未授权访问此页面")
        }
    })
});