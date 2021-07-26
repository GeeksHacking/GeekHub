import * as React from "react";
import { ReactElement } from "react";

import { Box, Flex, Heading, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import AppSidebarLink from "./AppSidebarLink";
import { SettingsIcon } from "@chakra-ui/icons";
import useProjects from "../../api/swr/projects/useProjects";

export default function AppSidebar(): Nullable<ReactElement> {
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
        return <Spinner/>;
    }
    
    return (
        <Flex direction={"column"} alignItems={"flex-start"} p={3}>
            <Box style={{ flex: 1 }}>
                <Input placeholder={"Search"}/>
                <Heading size={"md"} my={5}>Menu</Heading>

                <AppSidebarLink to={"/app"}>Home</AppSidebarLink>
                <AppSidebarLink to={"/app/projects"}>Projects</AppSidebarLink>

                <Heading size={"md"} my={5}>My projects</Heading>
                {data.map(project => (
                    <AppSidebarLink key={project.id} to={`/app/projects/${project.id}`}>{project.name}</AppSidebarLink>
                ))}
            </Box>
            <IconButton aria-label={"settings"} icon={<SettingsIcon/>}/>
        </Flex>
    );
}