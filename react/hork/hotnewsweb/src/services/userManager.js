import { createUserManager } from 'redux-oidc';
import { WebStorageStateStore } from 'oidc-client'
const OIDCConfig = window.OIDCconfig ;

const userManager = createUserManager(Object.assign(OIDCConfig, {
    userStore: new WebStorageStateStore({ store: window.localStorage })
}));

export default userManager;