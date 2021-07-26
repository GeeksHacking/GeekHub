import ticketsApi from "../../http/tickets";
import useSWR, { SWRResponse } from "swr";

export default function useTicketTypes(projectId: string): SWRResponse<string[], Error> {
    const { types } = ticketsApi(projectId);
    
    return useSWR(`Projects/${projectId}/Tickets/Types`, types);
}