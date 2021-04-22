import * as React from "react";

import { Flex } from "@chakra-ui/react";
import LandingNavBar from "../components/landing/LandingNavBar";

const Landing = (): React.ReactElement => {
    return (
        <Flex direction={"column"}>
            <LandingNavBar/>
        </Flex>
    );
};

export default Landing;