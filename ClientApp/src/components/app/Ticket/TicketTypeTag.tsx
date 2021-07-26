import * as React from "react";
import { ReactElement } from "react";
import { Tag } from "@chakra-ui/react";

export interface TicketTypeTag {
    type: string;
}

export default function TicketTypeTag(props: TicketTypeTag): ReactElement {
    const { type } = props;
    let color;
    switch (type) {
    case "Epic":
        color = "teal";
        break;
    case "Story":
        color = "gray";
        break;
    case "Bug":
        color = "red";
        break;
    case "Task":
        color = "green";
        break;
    default:
        color = "gray";
        break;
    }

    return <Tag colorScheme={color}>{type}</Tag>;
}