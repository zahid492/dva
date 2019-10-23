import { createUserManager } from 'redux-oidc';
const OIDCConfig = window.OIDCconfig ;

const userManager = createUserManager(OIDCConfig);

export default userManager;