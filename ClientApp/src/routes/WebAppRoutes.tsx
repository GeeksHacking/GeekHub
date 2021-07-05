import * as React from "react";
import { ReactElement } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import Home from "../pages/app/Home";
import ProjectsExplorer from "../pages/app/ProjectsExplorer";
import ProjectViewer from "../pages/app/ProjectViewer";
import { Flex } from "@chakra-ui/react";
import AppNavBar from "../components/app/AppNavBar";
import AppSidebar from "../components/app/AppSidebar";

const WebAppRoutes = (): ReactElement => {
    const { url } = useRouteMatch();

    return (
        <Flex direction={"column"} w={"100vw"} h={"100vh"}>
            <AppNavBar/>
            <Flex style={{ flex: 1 }}>
                <AppSidebar/>
                <Switch>
                    <Route exact path={`${url}/`} component={Home}/>
                    <Route exact path={`${url}/projects`} component={ProjectsExplorer}/>
                    <Route path={`${url}/projects/:projectId`} component={ProjectViewer}/>
                </Switch>
            </Flex>
        </Flex>
    );
};

export default WebAppRoutes;