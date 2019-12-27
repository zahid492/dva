import router from './router';
import store from './store/index';
import {Message} from 'element-ui';

router.beforeEach((to, from, next)=>{
    if(to.name!=="start" && (store.getters.token==="" || _.isNil(store.getters.token))){
        console.log("start")
        next("/start")
    }else{
        next();
    }
});