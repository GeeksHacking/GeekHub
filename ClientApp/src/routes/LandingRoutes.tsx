import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Landing from "../pages/Landing";

const LandingRoutes = (): React.ReactElement => {
    return (
        <Switch>
            <Route path={"/"} component={Landing}/>
        </Switch>
    );
};

export default LandingRoutes;