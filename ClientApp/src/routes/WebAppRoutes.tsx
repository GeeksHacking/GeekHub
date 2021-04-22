import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "../pages/app/Home";

const WebAppRoutes = (): React.ReactElement => {
    return (
        <Switch>
            <Route path={"/"} component={Home}/>
        </Switch>
    );
};

export default WebAppRoutes;