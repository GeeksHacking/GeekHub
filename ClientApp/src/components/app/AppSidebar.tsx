import * as React from "react";
import { ReactElement } from "react";

import { Box, Flex, Heading, IconButton, Input } from "@chakra-ui/react";
import AppSidebarLink from "./AppSidebarLink";
import { SettingsIcon } from "@chakra-ui/icons";

export default function AppSidebar(): ReactElement {
    return (
        <Flex direction={"column"} alignItems={"flex-start"} p={3}>
            <Box style={{ flex: 1 }}>
                <Input placeholder={"Search"}/>
                <Heading size={"md"} my={5}>Menu</Heading>

                <AppSidebarLink to={"/app"}>Home</AppSidebarLink>
                <AppSidebarLink to={"/app/projects"}>Projects</AppSidebarLink>

                <Heading size={"md"} my={5}>My projects</Heading>
            </Box>
            <IconButton aria-label={"settings"} icon={<SettingsIcon/>}/>
        </Flex>
    );
}