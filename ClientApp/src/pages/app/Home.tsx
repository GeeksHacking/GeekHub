import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import AppNavBar from "../../components/app/AppNavBar";
import AppSidebar from "../../components/app/AppSidebar";

const Home = (): React.ReactElement => {
    return (
        <Flex direction={"column"} w={"100vw"} h={"100vh"}>
            <AppNavBar/>
            <Flex style={{ flex: 1 }}>
                <AppSidebar/>
            </Flex>
        </Flex>
    );
};

export default Home;