import * as React from "react";
import { ReactElement } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

import Ticket from "../../../models/Ticket";

export interface TicketListItemProps {
    ticket: Ticket;
}

export default function TicketListItem(props: TicketListItemProps): Nullable<ReactElement> {
    const { ticket } = props;
    
    const bg = useColorModeValue("gray.100", "gray.700");
    
    return (
        <Box bg={bg} boxShadow={"base"} px={5} py={2} my={1}>
            <Text style={{ flex: 3 }}>
                {ticket.name}
            </Text>
        </Box>
    );
}