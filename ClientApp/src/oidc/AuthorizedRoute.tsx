import * as React from "react";
import { useEffect } from "react";

import { Route, Redirect, RouteComponentProps } from "react-router-dom";

import { Heading, Center, Spinner, VStack } from "@chakra-ui/react";

import { OidcPaths, QueryParameterNames } from "./AuthorizationConstants";
import authorizationService from "./AuthorizationService";

const AuthorizedRoute = (parentProps: {component: React.ComponentType<RouteComponentProps>; path: string}): React.ReactElement => {
    const [ready, setReady] = React.useState(false);
    const [authenticated, setAuthenticated] = React.useState(false);

    const onAuthStateChange = async () => {
        setReady(false);
        setAuthenticated(await authorizationService.isAuthenticated());
        setReady(true);
    };

    useEffect(() => {
        const subscriptionId = authorizationService.subscribe(onAuthStateChange);
        onAuthStateChange();
        return (() => {
            authorizationService.unsubscribe(subscriptionId);
        });
    }, []);

    if (!ready) {
        return (
            <Center w={"100vw"} h={"100vh"}>
                <VStack spacing={4}>
                    <Spinner size="xl" />
                    <Heading>Loading resources</Heading>
                </VStack>
            </Center>
        );
    }

    const { component: Component, path, ...rest } = parentProps;

    const redirectUrl = `${OidcPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(path)}`;

    return (
        <Route {...rest} render={props => authenticated ? <Component {...props} /> : <Redirect to={redirectUrl}/>}/>
    );
};

export default AuthorizedRoute;