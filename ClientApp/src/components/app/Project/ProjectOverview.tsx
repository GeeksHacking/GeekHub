import * as React from "react";
import { ReactElement } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import Project from "../../../models/Project";

export interface ProjectOverviewProps {
    project: Project;
}

export default function ProjectOverview(props: ProjectOverviewProps): ReactElement {
    const { project } = props;

    return (
        <Box>
            <Flex justifyContent={"space-between"}>
                <Box>
                    <Heading size={"md"}>Project overview</Heading>
                    <Text>{project.description}</Text>
                </Box>
                <Box>
                    <a href={project.repository} target={"_blank"} rel="noreferrer">
                        <Button>Source</Button>
                    </a>
                </Box>
            </Flex>
        </Box>
    );
}