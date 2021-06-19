import * as React from "react";
import { ReactElement } from "react";

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

export interface AppSidebarLinkProps {
    children: string;
    to: string;
}

export default function AppSidebarLink(props: AppSidebarLinkProps): ReactElement {
    const { to, children } = props;

    const matchBg = useColorModeValue("teal.100", "teal.700");
    const { pathname } = useLocation();

    return (
        <Link to={to}>
            <Box bg={pathname === to ? matchBg : "transparent"} py={2} px={3} mt={2} rounded={"base"} transition={"0.2s"}>
                <Text fontWeight={"bold"}>{children}</Text>
            </Box>
        </Link>
    );
}