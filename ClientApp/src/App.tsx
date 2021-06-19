import * as React from "react";
import {
    Switch
} from "react-router-dom";
import { Flex } from "@chakra-ui/react";

import Routes from "./routes";

const App = (): React.ReactElement => (
    <Switch>
        <Flex w={"100vw"} h={"100vh"} direction={"column"}>
            <Routes/>
        </Flex>
    </Switch>
);

export default App;
