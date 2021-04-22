import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { OidcPaths } from "../oidc/AuthorizationConstants";

import AuthorizedRoute from "../oidc/AuthorizedRoute";
import LandingRoutes from "./LandingRoutes";
import WebAppRoutes from "./WebAppRoutes";
import AuthorizationRoutes from "./AuthorizationRoutes";

import NotFound from "../pages/exceptions/NotFound";

const Routes = (): React.ReactElement => {
    return (
        <Switch>
            <Route exact path={"/"} component={LandingRoutes}/>
            <Route path={OidcPaths.ApiAuthorizationPrefix} component={AuthorizationRoutes}/>
            <AuthorizedRoute path={"/app"} component={WebAppRoutes}/>

            <Route component={NotFound}/>
        </Switch>
    );
};

export default Routes;
