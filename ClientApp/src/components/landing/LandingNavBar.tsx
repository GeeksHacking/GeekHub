import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";

import { Box, Flex, Spacer, Button, Heading, Menu, MenuItem, MenuList, MenuButton } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import authorizationService from "../../oidc/AuthorizationService";
import { OidcPaths } from "../../oidc/AuthorizationConstants";

const LandingNavBar = (): React.ReactElement => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const populateState = useCallback(async () => {
        const isAuthenticated = await authorizationService.isAuthenticated();
        setIsAuthenticated(isAuthenticated);
    }, []);


    useEffect(() => {
        const subscriptionId = authorizationService.subscribe(populateState);
        populateState();

        return () => {
            authorizationService.unsubscribe(subscriptionId);
        };
    }, [populateState]);

    return (
        <Flex p={"3"} align="center">
            <Box>
                <Heading size={"md"}>GeekHub</Heading>
            </Box>
            <Spacer/>
            <Box>
                {isAuthenticated ? (
                    <>
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
                        <NavLink to={"/app"}>
                            <Button colorScheme={"teal"}>Web app</Button>
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to={OidcPaths.Login}>
                            <Button mr={4}>Log in</Button>
                        </NavLink>
                        <NavLink to={OidcPaths.Register}>
                            <Button colorScheme={"teal"}>
                                Sign Up
                            </Button>
                        </NavLink>
                    </>
                )}
            </Box>
        </Flex>
    );
};

export default LandingNavBar;