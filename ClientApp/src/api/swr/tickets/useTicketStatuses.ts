import ticketsApi from "../../http/tickets";
import useSWR, { SWRResponse } from "swr";

export default function useTicketStatuses(projectId: string): SWRResponse<string[], Error> {
    const { statuses } = ticketsApi(projectId);
    
    return useSWR(`Projects/${projectId}/Tickets/Statuses`, statuses);
}