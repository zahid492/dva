import {parseJwt, firstLetterUppercase} from './utils'
import Oidc, {UserManager} from 'oidc-client'

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

export const getOidcCallbackPath = (oidcConfig) => {
    const domainStartsAt = '://'
    const hostAndPath = oidcConfig.redirect_uri.substr(oidcConfig.redirect_uri.indexOf(domainStartsAt) + domainStartsAt.length)
    return hostAndPath.substr(hostAndPath.indexOf('/'))
};

export const createOidcUserManager = (oidcConfig) => {
    const oidcSetting = Object.assign({
        // 改为localstorage 默认 sessionstorage
        userStore: new Oidc.WebStorageStateStore(),
        accessTokenExpiringNotificationTime: 10,
        automaticSilentRenew: true,
        filterProtocolClaims: true,
        loadUserInfo: true,
    }, oidcConfig)

    return new UserManager(oidcSetting)
};

export const addUserManagerEventListener = (oidcUserManager, eventName, eventListener) => {
    const addFnName = 'add' + firstLetterUppercase(eventName);
    // 加入支持的事件
    if (typeof oidcUserManager.events[addFnName] === 'function' && typeof eventListener === 'function') {
        oidcUserManager.events[addFnName](eventListener)
    }
};

export const removeUserManagerEventListener = (oidcUserManager, eventName, eventListener) => {
    const removeFnName = 'remove' + firstLetterUppercase(eventName);

    if (typeof oidcUserManager.events[removeFnName] === 'function' && typeof eventListener === 'function') {
        oidcUserManager.events[removeFnName](eventListener)
    }
};

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

export const processSilentSignInCallback = () => {
    new UserManager().signinSilentCallback()
};
