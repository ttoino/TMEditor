import { putConfig } from "@app/api";
import { getConfig } from "@common/api";
import type { ResponseSiteConfig } from "@types";
import useLocalState from "./useLocalState";
import { MainConfig } from "../../../types/src/database";

const useConfig = () =>
    useLocalState<ResponseSiteConfig & MainConfig>(
        "config",
        getConfig,
        ({ cache, databases, title, usersDB }) =>
            putConfig({ cache, databases, title, usersDB })
    );

export default useConfig;
