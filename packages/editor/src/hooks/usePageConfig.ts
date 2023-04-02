import { putPage } from "@app/api";
import { getPage } from "@common/api";
import type { PageResponse } from "@types";
import useLocalState from "./useLocalState";

const usePageConfig = (page: string | undefined) =>
    useLocalState<PageResponse>(
        ["page", page],
        () => getPage(page, new URLSearchParams()),
        (config) => putPage(page, config)
    );

export default usePageConfig;
