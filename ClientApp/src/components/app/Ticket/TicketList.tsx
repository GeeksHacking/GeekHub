import * as React from "react";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Text, Heading, Spinner, useToast, Button } from "@chakra-ui/react";

import Project from "../../../models/Project";
import useTickets from "../../../api/swr/tickets/useTickets";
import Ticket from "../../../models/Ticket";
import TicketListItem from "./TicketListItem";
import CreateTicketModal from "./CreateTicketModal";
import UpdateTicketModal from "./UpdateTicketModal";

export interface TicketListProps {
    project: Project;
}

export default function TicketList(props: TicketListProps): Nullable<ReactElement> {
    const { project } = props;

    const toast = useToast();
    const { data, error } = useTickets(project.id);

    const [selectedTicketId, setSelectedTicketId] = useState("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const tickets = useMemo(() => {
        if (!data) return;
        return data.reduce((a: Record<string, Ticket[]>, t) => {
            if (!a[t.ticketStatus]) {
                a[t.ticketStatus] = [];
            }
            a[t.ticketStatus].push(t);
            return a;
        }, {});
    }, [data]);

    if (error) {
        toast({
            status: "error",
            isClosable: true,
            title: "Error",
            description: "An error occurred while fetching project tickets"
        });
        return null;
    }

    if (!data || !tickets) {
        return <Spinner/>;
    }

    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);
    const openUpdateModal = (id: string) => {
        setSelectedTicketId(id);
        setUpdateModalOpen(true);
    };
    const closeUpdateModal = () => {
        setSelectedTicketId("");
        setUpdateModalOpen(false);
    };

    return (
        <Box height={"calc(100vh - 108px)"} maxHeight={"calc(100vh - 140px)"} overflowY={"scroll"}>
            <CreateTicketModal projectId={project.id} isOpen={createModalOpen} onClose={closeCreateModal}/>
            {updateModalOpen &&
            <UpdateTicketModal projectId={project.id} ticketId={selectedTicketId} isOpen={updateModalOpen}
                onClose={closeUpdateModal}/>}
            {Object.keys(tickets).map((type, idx) => (
                <>
                    <Box key={idx} mt={3}>
                        <Heading size={"lg"} mb={4}>{type}</Heading>
                        <Flex px={5} mb={2} color={"gray.500"}>
                            <Text size={"xs"} style={{ flex: 2 }}>Task name</Text>
                            <Text size={"xs"} style={{ flex: 1 }}>Reporter</Text>
                            <Text size={"xs"} style={{ flex: 1 }}>Assignee</Text>
                            <Text size={"xs"} style={{ flex: 0.5 }}>Type</Text>
                        </Flex>
                        {tickets[type].map(ticket => (
                            <TicketListItem ticket={ticket} projectId={project.id}
                                onClick={() => openUpdateModal(ticket.id)} key={ticket.id}/>
                        ))}
                    </Box>
                    {idx === Object.keys(tickets).length - 1 && <Box h={20}/>}
                </>
            ))}
            <Box position={"absolute"} bottom={7} right={7}>
                <Button colorScheme={"teal"} size={"lg"} onClick={openCreateModal}>New Ticket</Button>
            </Box>
        </Box>
    );
}