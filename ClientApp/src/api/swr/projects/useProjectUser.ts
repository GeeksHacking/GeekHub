import useSWR, { SWRResponse } from "swr";
import { fetcher } from "../fetcher";
import User from "../../../models/User";

export default function useProjectUser(projectId: string, userId?: string): SWRResponse<User, Error> {
    return useSWR<User>(`Projects/${projectId}/Users/${userId}`, userId ? fetcher : null);
}