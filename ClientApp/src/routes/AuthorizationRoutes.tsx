import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { LoginActions, LogoutActions, OidcPaths } from "../oidc/AuthorizationConstants";

import NotFound from "../pages/exceptions/NotFound";
import Login from "../pages/oidc/Login";
import Logout from "../pages/oidc/Logout";

const AuthorizationRoutes = (): React.ReactElement => {
    return (
        <Switch>
            <Route path={OidcPaths.Login} render={() => loginAction(LoginActions.Login)}/>
            <Route path={OidcPaths.LoginFailed} render={() => loginAction(LoginActions.LoginFailed)}/>
            <Route path={OidcPaths.LoginCallback} render={() => loginAction(LoginActions.LoginCallback)}/>
            <Route path={OidcPaths.Profile} render={() => loginAction(LoginActions.Profile)}/>
            <Route path={OidcPaths.Register} render={() => loginAction(LoginActions.Register)}/>
            <Route path={OidcPaths.LogOut} render={() => logoutAction(LogoutActions.Logout)}/>
            <Route path={OidcPaths.LogOutCallback} render={() => logoutAction(LogoutActions.LogoutCallback)}/>
            <Route path={OidcPaths.LoggedOut} render={() => logoutAction(LogoutActions.LoggedOut)}/>

            <Route component={NotFound}/>
        </Switch>
    );
};

function loginAction(name: string){
    return (<Login action={name}/>);
}

function logoutAction(name: string) {
    return (<Logout action={name}/>);
}

export default AuthorizationRoutes;