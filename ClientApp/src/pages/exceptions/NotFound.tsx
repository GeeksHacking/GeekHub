import * as React from "react";
import { Center, Heading, Button, VStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const NotFound = (): React.ReactElement => {
    return (
        <Center w={"100vw"} h={"100vh"}>
            <VStack spacing={5}>
                <Heading size={"4xl"}>:(</Heading>
                <Heading>Page not found</Heading>
                <NavLink to={"/"}>
                    <Button>Go back to homepage</Button>
                </NavLink>
            </VStack>
        </Center>
    );
};

export default NotFound;