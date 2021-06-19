import * as React from "react";
import { ReactElement, useEffect, useRef } from "react";
import { Box, Flex, Text, Heading, Spinner, useToast } from "@chakra-ui/react";

import Project from "../../../models/Project";
import useTickets from "../../../api/swr/tickets/useTickets";
import Ticket from "../../../models/Ticket";
import TicketListItem from "./TicketListItem";

export interface TicketListProps {
    project: Project;
}

export default function TicketList(props: TicketListProps): Nullable<ReactElement> {
    const { project } = props;

    const toast = useToast();
    const { data, error } = useTickets(project.id);
    const tickets = useRef<Record<string, Ticket[]>>({});

    useEffect(() => {
        if (!data) return;
        tickets.current = data.reduce((a: Record<string, Ticket[]>, t) => {
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

    if (!data) {
        return <Spinner/>;
    }
    
    return (
        <Box height={"calc(100vh - 108px)"} maxHeight={"calc(100vh - 140px)"} overflowY={"scroll"}>
            {Object.keys(tickets.current).map((type, idx) => (
                <Box key={idx} mt={3}>
                    <Heading size={"lg"} mb={4}>{type}</Heading>
                    <Flex mb={2} color={"gray.500"}>
                        <Text size={"xs"} style={{ flex: 2 }}>Task name</Text>
                        <Text size={"xs"} style={{ flex: 1 }}>Assignee</Text>
                    </Flex>
                    {tickets.current[type].map(ticket => (
                        <TicketListItem ticket={ticket} key={ticket.id}/>
                    ))}
                </Box>
            ))}
        </Box>
    );
}