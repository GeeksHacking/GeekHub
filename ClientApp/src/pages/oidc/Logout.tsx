import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import {
    LogoutActions,
    QueryParameterNames,
    OidcPaths,
} from "../../oidc/AuthorizationConstants";
import authorizationService, {
    AuthorizationStatus,
} from "../../oidc/AuthorizationService";
import {
    Center,
    Heading,
    Spinner,
    Text,
    VStack,
    Button,
} from "@chakra-ui/react";

interface LogoutProps extends RouteComponentProps<Record<string, string>> {
  action: string;
}

interface LogoutState {
  message: string;
}

class Logout extends React.Component<LogoutProps, LogoutState> {
    constructor(props: LogoutProps) {
        super(props);
        this.state = {
            message: "",
        };
    }

    async componentDidMount(): Promise<void> {
        const { action } = this.props;

        switch (action) {
        case LogoutActions.Logout:
            if (!this.props.location) {
                this.setState({
                    message: "The logout was not initiated from within the page.",
                });
                return;
            }

            const { local } = this.props.location?.state as Record<string, string>;

            if (local) {
                const returnUrl = this.getReturnUrl();
                await this.logout(returnUrl);
            } else {
                this.setState({
                    message: "The logout was not initiated from within the page.",
                });
            }
            break;
        case LogoutActions.LogoutCallback:
            await this.processLogoutCallback();
            break;
        case LogoutActions.LoggedOut:
            this.setState({ message: "You successfully logged out!" });
            break;
        default:
            throw new Error(`Invalid action '${action}'`);
        }
    }

    async logout(returnUrl: string): Promise<void> {
        const isAuthenticated = await authorizationService.isAuthenticated();

        if (!isAuthenticated) {
            this.setState({ message: "Invalid authentication result status." });
        } else {
            const result = await authorizationService.signOut({ returnUrl });
            switch (result.status) {
            case AuthorizationStatus.Redirect:
                break;
            case AuthorizationStatus.Success:
                this.navigateToReturnUrl(returnUrl);
                break;
            case AuthorizationStatus.Fail:
                this.setState({ message: result.message ?? "" });
                break;
            default:
                throw new Error("Invalid authentication result status.");
            }
        }
    }

    async processLogoutCallback(): Promise<void> {
        const result = await authorizationService.completeSignOut(
            window.location.href
        );

        switch (result.status) {
        case AuthorizationStatus.Redirect:
            throw new Error("Should not redirect");
        case AuthorizationStatus.Success:
            const { returnUrl } = result.state ?? {};
            const url = this.getReturnUrl(returnUrl);
            this.navigateToReturnUrl(url);
            break;
        case AuthorizationStatus.Fail:
            this.setState({ message: result.message ?? "" });
            break;
        default:
            throw new Error("Invalid authentication result status.");
        }
    }

    navigateToReturnUrl(returnUrl: string): void {
        window.location.replace(returnUrl);
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
      `${window.location.origin}${OidcPaths.LoggedOut}`
        );
    }

    render(): React.ReactNode {
        const { message } = this.state;
        return (
            <Center w={"100vw"} h={"100vh"}>
                <VStack spacing={4}>
                    {!message && <Spinner size="xl" />}
                    <Heading>
                        {message ? "Completed logout" : "Processing logout"}
                    </Heading>
                    <Text>{message ?? "This may take up to a minute"}</Text>
                    {message && (
                        <NavLink to={"/"}>
                            <Button>Go back to homepage</Button>
                        </NavLink>
                    )}
                </VStack>
            </Center>
        );
    }
}

export default withRouter(Logout);
