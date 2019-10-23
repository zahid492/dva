import {
    getOidcCallbackPath,
    createOidcUserManager,
    addUserManagerEventListener,
    // removeUserManagerEventListener,
    tokenIsExpired,
    tokenExp
} from '@/service/oidc-helpers';
import {dispatchCustomBrowserEvent} from '@/service/browser-event';


const mgr = createOidcUserManager(oidcConfig);

// 添加浏览器事件监听
if (oidcConfig.dispatchEventsOnWindow) {
    // Dispatch oidc-client events on window (if in browser)
    const userManagerEvents = [
        'userLoaded',
        'userUnloaded',
        'accessTokenExpiring',
        'accessTokenExpired',
        'silentRenewError',
        'userSignedOut'
    ];
    userManagerEvents.forEach(eventName => {
        addUserManagerEventListener(mgr, eventName, (e) => {
            const detail = e && e.detail ? e.detail : {};
            dispatchCustomBrowserEvent(eventName, detail);
        })
    })
}

// 自定义的事件回调
const oidcEventListeners = {
    userLoaded: function (user) {
        // console.log('New User Loaded：', arguments);
        // console.log('Acess_token: ', user.access_token)
    },

    userSignedOut: function () {
        console.log('UserSignedOut：', arguments);
    },

    // 由 automaticSilentRenew 触发
    accessTokenExpiring: function () {
        console.log('AccessToken Expiring：', arguments);
    },

    accessTokenExpired: function () {
        console.log('AccessToken Expired：', arguments);
        mgr.signoutRedirect().then(function () {
            console.log('signout redirect');
        }).catch(function (err) {
            console.log(err)
        })
    },

    silentRenewError: function () {
        console.error('Silent Renew Error：', arguments);
    },
};

// 把上述自定义事件添加到
Object.keys(oidcEventListeners).forEach(eventName => {
    addUserManagerEventListener(mgr, eventName, oidcEventListeners[eventName])
});

const oidcCallbackPath = getOidcCallbackPath(oidcConfig);

const routeIsOidcCallback = (route) => {
    if (route.meta.isOidcCallback) {
        return true;
    }

    if (route.path && route.path == oidcCallbackPath) {
        return true;
    }

    return false;
};

// 是否授权
const isAuthenticated = (state) => {
    if (state.access_token) {
        return true
    }
    return false
};

// 路由是否通用路径
const routeIsPublic = (route) => {
    if (route.meta.isPublic) {
        return true
    }
    return false
};

const omgr = {
    state: {
        access_token: null,
        user: null,
        // 可能没有
        scopes: null,
        events_are_bound: false,
    },
    getters: {
        // 是否认证
        oidcIsAuthenticated: (state) => {
            return isAuthenticated(state)
        },
        // 用户信息
        oidcUser: (state) => {
            return state.user
        },
        // accessToken
        oidcAccessToken: (state) => {
            return tokenIsExpired(state.access_token) ? null : state.access_token
        },
        // accessToken 是否过期
        oidcAccessTokenExp: (state) => {
            return tokenExp(state.access_token)
        },
        // 发生错误
        oidcError: (state) => {
            return state.error
        },
        // 公共路径检测
        oidcIsRoutePublic: (state) => {
            return (route) => {
                return routeIsPublic(route)
            }
        }
    },
    mutations: {
        setOidcAuth(state, user) {
            state.access_token = user.access_token;
            state.user = user.profile;
            state.scopes = user.scopes;
            state.error = null;
        },
        setOidcUser(state, user) {
            state.user = user.profile;
        },
        unsetOidcAuth(state) {
            state.access_token = null;
            state.user = null;
        },
        setOidcError(state, error) {
            state.error = error && error.message ? error.message : error;
        },
        setOidcEventsAreBound(state) {
            state.events_are_bound = true
        },
    },
    actions: {
        // 检测路由是否公共路径，或 oidc callback 路径，且是否已访问过(代表通过授权验证)。
        oidcCheckAccess(context, route) {
            return new Promise((resolve) => {
                if (routeIsOidcCallback(route)) {
                    resolve(true);
                    return;
                }

                let hasAccess = true;
                let getUserPromise = new Promise(resolve => {
                    mgr.getUser().then(user => {
                        resolve(user);
                    }).catch(() => {
                        resolve(null)
                    })
                });
                // 以前是否登录过 TODO,
                let isAuthenticatedInStore = isAuthenticated(context.state);

                getUserPromise.then(user => {
                    // 无用户或过期
                    if (!user || user.expired) {
                        if (isAuthenticatedInStore) {
                            // 清除旧数据
                            context.commit("unsetOidcAuth");
                        }

                        if (routeIsPublic(route)) {
                            if (oidcConfig.silent_redirect_uri) {
                                console.log("用户过期1")
                                // 公共路由要静默认证，for api call
                                context.dispatch("authenticateOidcSilent")
                            }
                        } else {
                            //重新认证
                            context.dispatch("authenticateOidc", route.path);
                            hasAccess = false;
                        }
                    } else {
                        // 已认证过
                        context.dispatch("oidcWasAuthenticated", user);
                        if (!isAuthenticatedInStore) {
                            // 调用 userLoaded, 建立 session。通过触发userLoaded 事件
                            // if (oidcEventListeners
                            //     && typeof oidcEventListeners.userLoaded === 'function') {
                            //     oidcEventListeners.userLoaded(user);
                            // }
                            //
                            // if (oidcConfig.dispatchEventsOnWindow) {
                            //     dispatchCustomBrowserEvent('userLoaded', user);
                            // }
                        }
                    }

                    resolve(hasAccess);
                })
            })
        },
        // 重定向到认证页面
        authenticateOidc(context, redirectPath) {
            redirectPath += (document.location.search || "") + (document.location.hash || "");
            sessionStorage.setItem('vuex_oidc_active_route', redirectPath);
            mgr.signinRedirect().catch(err => {
                context.commit("setOidcError", err);
            });
        },
        // 静默认证
        authenticateOidcSilent(context) {
            mgr.signinSilent().then(user => {
                context.dispatch("oidcWasAuthenticated", user);
            }).catch(err => {
                context.commit("setOidcError", err);
            })
        },
        // 认证后
        oidcWasAuthenticated(context, user) {
            context.commit("setOidcAuth", user);
            // 监听事件是否绑定，没绑定就绑定 过期事件（快要过期和已经过期）
            if (!context.state.events_are_bound) {
                // 添加过期事件, 过期时间到后删除旧授权信息
                mgr.events.addAccessTokenExpired(() => {
                    context.commit('unsetOidcAuth')
                });
                // 自动 renew 配置了，则过期事件发生触发静默授权 renew
                if (oidcConfig.automaticSilentRenew) {
                    mgr.events.addAccessTokenExpiring(() => {
                        console.log("用户过期2")
                        context.dispatch('authenticateOidcSilent')
                    });
                }
                // 标记授权事件是否绑定
                context.commit('setOidcEventsAreBound')
            }
        },
        // 授权页面的回调，触发已授权
        oidcSignInCallback(context) {
            return new Promise((resolve, reject) => {
                mgr.signinRedirectCallback().then(user => {
                    context.dispatch("oidcWasAuthenticated", user);
                    sessionStorage.setItem('oidc_user', JSON.stringify(user));
                    resolve(sessionStorage.getItem('vuex_oidc_active_route') || '/')
                }).catch(err => {
                    context.commit('setOidcError', err)
                    reject(err)
                })
            })
        },
        // 获取用户
        getOidcUser(context) {
            mgr.getUser().then(user => {
                context.commit("setOidcUser", user);
            })
        },
        // 登出重定向
        signOutOidc(context) {
            mgr.signoutRedirect().then(() => {
                context.commit("unsetOidcAuth");
            });
        },

    }
};

export default omgr;