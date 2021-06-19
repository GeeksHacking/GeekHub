import * as React from "react";
import { ReactElement } from "react";

import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    useColorMode, useColorModeValue
} from "@chakra-ui/react";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { OidcPaths } from "../../oidc/AuthorizationConstants";
import { NavLink } from "react-router-dom";

const AppNavBar = (): ReactElement => {

    const { colorMode, toggleColorMode } = useColorMode();
    const borderBottom = useColorModeValue("gray.300", "gray.700");

    return (
        <Flex p={"3"} align="center" borderBottomStyle={"solid"} borderBottomColor={borderBottom} borderBottomWidth={2}>
            <Box>
                <Heading size={"md"}>GeekHub</Heading>
            </Box>
            <Spacer/>
            <Box>
                <IconButton
                    mr={3}
                    aria-label={"toggle"} 
                    
                    icon={colorMode === "dark" ? <SunIcon/> : <MoonIcon/>}
                    onClick={toggleColorMode}
                />
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