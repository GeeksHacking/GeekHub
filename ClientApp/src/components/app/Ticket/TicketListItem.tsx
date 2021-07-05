import * as React from "react";
import { ReactElement } from "react";
import { Avatar, Box, Flex, Spinner, Tag, TagLabel, Text, useColorModeValue, useToast } from "@chakra-ui/react";

import Ticket from "../../../models/Ticket";
import useProjectUser from "../../../api/swr/projects/useProjectUser";
import TicketTypeTag from "./TicketTypeTag";

export interface TicketListItemProps {
    ticket: Ticket;
    projectId: string;
}

export default function TicketListItem(props: TicketListItemProps): Nullable<ReactElement> {
    const { ticket, projectId } = props;

    const toast = useToast();
    const bg = useColorModeValue("gray.100", "gray.700");
    const { data: assignee, error: assigneeError } = useProjectUser(projectId, ticket.assigneeId);
    const { data: reporter, error: reporterError } = useProjectUser(projectId, ticket.reporterId);

    if (assigneeError || reporterError) {
        toast({
            status: "error",
            isClosable: true,
            title: "Error",
            description: "An error occurred while fetching ticket details"
        });
        return null;
    }

    return (
        <Flex bg={bg} boxShadow={"base"} px={5} py={2} my={1} h={12} borderRadius={"md"}>
            <Text style={{ flex: 2 }}>
                {ticket.name}
            </Text>
            <Box style={{ flex: 1 }}>
                {reporter && (
                    <Tag size="lg" colorScheme="red" borderRadius="full">
                        <Avatar
                            size={"xs"}
                            name={reporter.userName}
                            ml={-1}
                            mr={2}
                        />
                        <TagLabel>{reporter.userName}</TagLabel>
                    </Tag>
                )}
            </Box>
            <Box style={{ flex: 1 }}>
                {assignee && (
                    <Tag size="lg" colorScheme="red" borderRadius="full">
                        <Avatar
                            size={"xs"}
                            name={assignee.userName}
                            ml={-1}
                            mr={2}
                        />
                        <TagLabel>{assignee.userName}</TagLabel>
                    </Tag>
                )}
            </Box>
            <Flex style={{ flex: 0.5 }} alignItems={"center"}>
                <TicketTypeTag type={ticket.ticketType}/>
            </Flex>
        </Flex>
    );
}