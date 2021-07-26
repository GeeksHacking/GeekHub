import useSWR, { SWRResponse } from "swr";
import { fetcher } from "../fetcher";
import Project from "../../../models/Project";

export default function useProjects(): SWRResponse<Project[], Error> {
    return useSWR<Project[]>("Projects", fetcher);
}