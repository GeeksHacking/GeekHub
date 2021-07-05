import Ticket from "../../models/Ticket";
import { apiClient } from "./base";
import CreateTicketRequest from "../dtos/tickets/CreateTicketRequest";

export interface TicketsApi {
    create: (ticket: CreateTicketRequest) => Promise<Ticket>;
    types: () => Promise<string[]>;
    statuses: () => Promise<string[]>;
}

export default function tickets(projectId: string): TicketsApi {
    return {
        create: async (ticket) => {
            return await apiClient.post(`Projects/${projectId}/Tickets`, { json: ticket }).json<Ticket>();
        },
        types: async () => {
            return await apiClient.get(`Projects/${projectId}/Tickets/Types`).json<string[]>();
        },
        statuses: async () => {
            return await apiClient.get(`Projects/${projectId}/Tickets/Statuses`).json<string[]>();
        }
    };
}