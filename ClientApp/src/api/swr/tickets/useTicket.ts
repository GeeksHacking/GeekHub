import useSWR, { SWRResponse } from "swr";
import Ticket from "../../../models/Ticket";
import { fetcher } from "../fetcher";

export default function useTicket(projectId: string, ticketId: string): SWRResponse<Ticket, Error> {
    return useSWR<Ticket>(`Projects/${projectId}/Tickets/${ticketId}`, fetcher);
}