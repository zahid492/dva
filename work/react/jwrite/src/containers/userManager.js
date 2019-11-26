import Oidc from "oidc-client";
import * as apiUrl from "@/services/ApiUrl";

const userManager = new Oidc.UserManager(apiUrl.OIDCConfig);

export default userManager;