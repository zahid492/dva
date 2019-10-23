import Oidc, {UserManager} from 'oidc-client';
import {parseJwt} from '@/utils/index';

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

export const tokenExp = (token) => {
    if (token) {
        const parsed = parseJwt(token);
        return parsed.exp ? parsed.exp * 1000 : null
    }
    return null
};

export const tokenIsExpired = (token) => {
    const tokenExpiryTime = tokenExp(token);

    if (tokenExpiryTime) {
        return tokenExpiryTime < new Date().getTime()
    }

    return false
};

// 是否授权
const isAuthenticated = (state) => {
    if (state.access_token) {
        return true
    }
    return false
};

//
const getOidcCallbackPath = (oidcConfig) => {
    const domainStartsAt = '://'
    const hostAndPath = oidcConfig.redirect_uri.substr(oidcConfig.redirect_uri.indexOf(domainStartsAt) + domainStartsAt.length)
    return hostAndPath.substr(hostAndPath.indexOf('/'))
};

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

// 路由是否通用路径
const routeIsPublic = (route) => {
    if (route.meta.isPublic) {
        return true
    }
    return false
};

const oidcSetting = Object.assign({
    // 改为localstorage 默认 sessionstorage
    userStore: new Oidc.WebStorageStateStore(),
    accessTokenExpiringNotificationTime: 10,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
}, oidcConfig);

const mgr =  new UserManager(oidcSetting);

const omgr = {
    state:{
        access_token: null,
        user: null,
        // 可能没有
        scopes: null,
    },
    getters:{
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
    },
    mutations:{
        setOidcAuth(state, user) {
            state.access_token = user.access_token;
            state.user = user.profile;
            state.scopes = user.scopes;
            state.error = null;
        },
        unsetOidcAuth(state) {
            state.access_token = null;
            state.user = null;
        },
        setOidcError(state, error) {
            state.error = error && error.message ? error.message : error;
        }
    },
    actions:{
        oidcCheckAccess(context, route) {
            return new Promise((resolve) =>{
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

                let isAuthenticatedInStore = isAuthenticated(context.state);

                getUserPromise.then(user=>{
                    if(!user || user.expired){
                        if (isAuthenticatedInStore) {
                            // 清除旧数据
                            context.commit("unsetOidcAuth");
                        }

                        if(routeIsPublic(route)){
                            if(oidcConfig.silent_redirect_uri){
                                context.dispatch("authenticateOidcSlient")
                            }
                        }else{
                            context.dispatch("authenticateOidc", route.path);
                            hasAccess = false;
                        }

                    }else{
                        context.dispatch("oidcWasAuthenticated", user);
                        if(!isAuthenticatedInStore){
                        // 事件分发
                        }
                    }

                    resolve(hasAccess);
                })
            });
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
        authenticateOidcSlient(context) {
            mgr.signinSlient().then(user => {
                context.dispatch("oidcWasAuthenticated", user);
            }).catch(err => {
                context.commit("setOidcError", err);
            })
        },
        // 认证后
        oidcWasAuthenticated(context, user) {
            context.commit("setOidcAuth", user);
        },
        // 授权页面的回调，触发已授权
        oidcSignInCallback(context) {
            return new Promise((resolve, reject) => {
                mgr.signinRedirectCallback().then(user => {
                    context.dispatch("oidcWasAuthenticated", user);
                    resolve(sessionStorage.getItem('vuex_oidc_active_route') || '/')
                }).catch(err => {
                    context.commit('setOidcError', err)
                    reject(err)
                })
            })
        },
        // 登出重定向
        signOutOidc(context) {
            mgr.signoutRedirect().then(() => {
                context.commit("unsetOidcAuth");
            });
        }
    }

};

export default omgr;