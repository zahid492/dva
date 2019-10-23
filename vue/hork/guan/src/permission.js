import router from './router';



router.beforeEach((to, from, next) => {

    console.log(to)
    console.log(from)
    if(detector.device.name === "pc"){
        if(from.path === "/"){
            next({path: "/home", replace: true})
        }else{
            // let topc = _.assign({}, to, {path: _.replace(to.path, "mb", "home")});
            // next(topc)
            next()
        }
    }else{
        if(from.path ==="/"){
            next({path: "/mb", replace: true})
        }else{
            // let tomb = _.assign({}, to, {path: _.replace(to.path, "home", "mb")});
            // next(tomb)
            next()
        }

    }

});
