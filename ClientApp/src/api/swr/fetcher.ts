import { apiClient } from "../http/base";

export const fetcher = async <T>(url: string): Promise<T> => {
    return await apiClient.get(url).json<T>();
};
