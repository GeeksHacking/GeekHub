import ky from "ky";
import authorizationService from "../../oidc/AuthorizationService";

export const apiClient = ky.create({
    prefixUrl: "/",
    hooks: {
        beforeRequest: [
            async (request) => {
                request.headers.set(
                    "Authorization",
                    `Bearer ${await authorizationService.getAccessToken()}`
                );
            },
        ],
        afterResponse: [
            async (request, _options, response) => {
                if (response.status !== 401) return;

                await authorizationService.signIn({});
                return ky(request);
            },
        ],
    },
});

export const authClient = ky.create({
    prefixUrl: "/"
});
