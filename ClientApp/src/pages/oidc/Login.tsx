import * as React from "react";

import { RouteComponentProps, withRouter } from "react-router";
import { Heading, Text, Center, Spinner, VStack } from "@chakra-ui/react";

import {
    LoginActions,
    OidcPaths,
    QueryParameterNames,
} from "../../oidc/AuthorizationConstants";
import authorizationService, {
    AuthorizationStatus,
} from "../../oidc/AuthorizationService";

interface LoginProps extends RouteComponentProps<Record<string, string>> {
    action: string;
}

interface LoginState {
    message: string;
}

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            message: "",
        };
    }

    async componentDidMount(): Promise<void> {
        const { action, match: { params } = { params: {} } } = this.props;

        switch (action) {
        case LoginActions.Login:
            await this.login(this.getReturnUrl());
            break;
        case LoginActions.LoginCallback:
            await this.processLoginCallback();
            break;
        case LoginActions.LoginFailed:
            const error = params[QueryParameterNames.Message];
            this.setState({ message: error });
            break;
        case LoginActions.Profile:
            this.redirectToProfile();
            break;
        case LoginActions.Register:
            this.redirectToRegister();
            break;
        default:
            break;
        }
    }

    redirectToRegister(): void {
        this.redirectToApiAuthorizationPath(
            `${OidcPaths.IdentityRegisterPath}?${
                QueryParameterNames.ReturnUrl
            }=${encodeURI(OidcPaths.Login)}`
        );
    }

    redirectToProfile(): void {
        this.redirectToApiAuthorizationPath(OidcPaths.IdentityManagePath);
    }

    redirectToApiAuthorizationPath(apiAuthorizationPath: string): void {
        const redirectUrl =
            apiAuthorizationPath.includes(OidcPaths.IdentityRegisterPath) ||
            apiAuthorizationPath.includes(OidcPaths.IdentityManagePath)
                ? `/${apiAuthorizationPath}`
                : `${window.location.origin}/${apiAuthorizationPath}`;

        this.navigateToReturnUrl(redirectUrl);
    }

    async login(returnUrl: string): Promise<void> {
        const state = { returnUrl };
        const result = await authorizationService.signIn(state);

        switch (result.status) {
        case AuthorizationStatus.Redirect:
            break;
        case AuthorizationStatus.Success:
            this.navigateToReturnUrl(returnUrl);
            break;
        case AuthorizationStatus.Fail:
            this.setState({ message: result.message ?? "" });
        }
    }

    async processLoginCallback(): Promise<void> {
        const result = await authorizationService.completeSignIn(
            window.location.href
        );
        switch (result.status) {
        case AuthorizationStatus.Redirect:
            throw new Error("Should not redirect.");
        case AuthorizationStatus.Success:
            const { returnUrl } = result.state ?? {};
            const url = this.getReturnUrl(returnUrl);
            this.navigateToReturnUrl(url);
            break;
        case AuthorizationStatus.Fail:
            this.setState({ message: result.message ?? "" });
            break;
        default:
            throw new Error(
                `Invalid authentication result status '${result.status}'.`
            );
        }
    }

    getReturnUrl(returnUrl?: string): string {
        const { match } = this.props;
        if (match && QueryParameterNames.ReturnUrl in match.params) {
            if (
                !match.params[QueryParameterNames.ReturnUrl].startsWith(
                    `${window.location.origin}/`
                )
            ) {
                throw new Error(
                    "Invalid return url. The return url needs to have the same origin as the current page."
                );
            }
        }

        return (
            returnUrl ||
            (match && match.params[QueryParameterNames.ReturnUrl]) ||
            `${window.location.origin}/`
        );
    }

    navigateToReturnUrl(returnUrl: string): void {
        window.location.replace(returnUrl);
    }

    render(): React.ReactNode {
        return (
            <Center w={"100vw"} h={"100vh"}>
                <VStack spacing={4}>
                    <Spinner size="xl" />
                    <Heading>Processing login</Heading>
                    <Text>
                        {this.state.message ?? "This may take up to a minute"}
                    </Text>
                </VStack>
            </Center>
        );
    }
}

export default withRouter(Login);