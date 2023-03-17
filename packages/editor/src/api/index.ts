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
