import useSWR, { SWRResponse } from "swr";
import { fetcher } from "../fetcher";
import User from "../../../models/User";

export default function useProjectUsers(projectId: string): SWRResponse<User[], Error> {
    return useSWR<User[]>(`Projects/${projectId}/Users`, fetcher);
}