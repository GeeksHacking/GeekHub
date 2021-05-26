import * as React from "react";
import { ReactElement } from "react";

import { Box, Button, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Spacer } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { OidcPaths } from "../../oidc/AuthorizationConstants";
import { NavLink } from "react-router-dom";

const AppNavBar = (): ReactElement => {
    return (
        <Flex p={"3"} align="center">
            <Box>
                <Heading size={"md"}>GeekHub</Heading>
            </Box>
            <Spacer/>
            <Box>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} mr={4}>
                        My Account
                    </MenuButton>
                    <MenuList>
                        <a href={`/${OidcPaths.IdentityManagePath}`}>
                            <MenuItem>Manage</MenuItem>
                        </a>
                        <NavLink to={{ pathname: OidcPaths.LogOut, state: { local: true } }}>
                            <MenuItem>Logout</MenuItem>
                        </NavLink>
                    </MenuList>
                </Menu>
            </Box>
        </Flex>
    );
};

export default AppNavBar;