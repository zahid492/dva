import { createUserManager } from 'redux-oidc';
const oidcConfig = window.oidcConfig ;

const userManager = createUserManager(oidcConfig);

export default userManager;