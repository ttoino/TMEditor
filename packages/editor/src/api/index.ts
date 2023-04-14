import axios from "axios";
import type {
    MainConfig,
    Page,
    PageResponse,
    ResponseSiteConfig,
} from "@types";
import { getApiUrl } from "@common/api";

export const putConfig = async (
    config: MainConfig,
    apiUrl?: string
): Promise<ResponseSiteConfig> => {
    const response = await axios.put(`${getApiUrl(apiUrl)}/config`, config);

    return response.data;
};

export const putPage = async (
    page: string | undefined,
    config: Page,
    apiUrl?: string
): Promise<PageResponse> => {
    const response = await axios.put(
        `${getApiUrl(apiUrl)}/pages/${page}`,
        config
    );

    return response.data;
};

export const getReducers = async (apiUrl?: string): Promise<string> => {
    const response = await axios.get(`${getApiUrl(apiUrl)}/reducers`);

    return response.data;
};

export const putReducers = async (
    reducers: string,
    apiUrl?: string
): Promise<string> => {
    const response = await axios.put(
        `${getApiUrl(apiUrl)}/reducers`,
        reducers,
        { headers: { "Content-Type": "text/plain" } }
    );

    return response.data;
};
