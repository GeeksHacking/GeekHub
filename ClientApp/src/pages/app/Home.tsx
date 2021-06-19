import * as React from "react";
import { Box, Center, Flex, Spinner, useToast } from "@chakra-ui/react";
import AppNavBar from "../../components/app/AppNavBar";
import AppSidebar from "../../components/app/AppSidebar";
import useProjects from "../../api/swr/projects/useProjects";
import { FC, ReactElement } from "react";

const Home: FC = () => {
    const toast = useToast();
    const { data, error } = useProjects();
    
    if (error) {
        toast({
            status: "error",
            isClosable: true,
            title: "Error",
            description: "An error occurred while fetching your projects"
        });
        return null;
    }
    
    if (!data) {
        return (
            <Flex w={"100vw"} h={"100vh"}>
                <Center style={{ flex: 1 }}>
                    <Spinner/>
                </Center>
            </Flex>
        );
    }
    
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