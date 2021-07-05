import Project from "../../models/Project";
import { apiClient } from "./base";
import CreateProjectRequest from "../dtos/projects/CreateProjectRequest";

export async function create(project: CreateProjectRequest): Promise<Project> {
    return await apiClient.post("Projects", { json: project }).json<Project>();
}

const projects = { create };

export default projects;