import * as React from "react";
import { ReactElement } from "react";
import { useParams } from "react-router";
import useProjects from "../../api/swr/projects/useProjects";
import { Flex, Spinner, useToast } from "@chakra-ui/react";
import ProjectTabBar from "../../components/app/Project/ProjectTabBar";
import ProjectOverview from "../../components/app/Project/ProjectOverview";
import TicketList from "../../components/app/Ticket/TicketList";

export default function ProjectViewer(): Nullable<ReactElement> {
    const { projectId } = useParams<{ projectId: string }>();

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

    const project = data.find(p => p.id === projectId);

    if (!project) {
        toast({
            status: "error",
            isClosable: true,
            title: "Error",
            description: "An error occurred while fetching your projects"
        });
        return null;
    }

    return (
        <Flex style={{ flex: 1 }}>
            <ProjectTabBar 
                overview={<ProjectOverview project={project}/>} 
                lists={<TicketList project={project}/>} 
                kanban={<div/>} 
                calendar={<div/>}
            />
        </Flex>
    );
}