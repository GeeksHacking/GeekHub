import { WebStorageStateStore } from "oidc-client";
import { authClient } from "./base";

export interface OidcConfigResponse {
    automaticSilentRenew?: boolean;
    includeIdTokenInSilentRenew?: boolean;
    userStore?: WebStorageStateStore;
}

export const get = async (path: string): Promise<OidcConfigResponse> => {
    return await authClient.get(path).json<OidcConfigResponse>();
};

const oidc = {
    get
};

export default oidc;