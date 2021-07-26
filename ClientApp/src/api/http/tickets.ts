import Ticket from "../../models/Ticket";
import { apiClient } from "./base";
import CreateTicketRequest from "../dtos/tickets/CreateTicketRequest";
import { Operation } from "fast-json-patch";

export interface TicketsApi {
    create: (ticket: CreateTicketRequest) => Promise<Ticket>;
    update: (id: string, ticket: Operation[]) => Promise<Ticket>;
    types: () => Promise<string[]>;
    statuses: () => Promise<string[]>;
}

export default function tickets(projectId: string): TicketsApi {
    return {
        create: async (ticket) => {
            return await apiClient.post(`Projects/${projectId}/Tickets`, { json: ticket }).json<Ticket>();
        },
        update: async (id, ticket) => {
            return await apiClient.patch(`Projects/${projectId}/Tickets/${id}`, { json: ticket }).json<Ticket>();
        },
        types: async () => {
            return await apiClient.get(`Projects/${projectId}/Tickets/Types`).json<string[]>();
        },
        statuses: async () => {
            return await apiClient.get(`Projects/${projectId}/Tickets/Statuses`).json<string[]>();
        }
    };
}