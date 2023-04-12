import { putConfig } from "@app/api";
import { getConfig } from "@common/api";
import type { ResponseSiteConfig } from "@types";
import useLocalState from "./useLocalState";

const useConfig = () =>
    useLocalState<ResponseSiteConfig>("config", getConfig, putConfig);

export default useConfig;
