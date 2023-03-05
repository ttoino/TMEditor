import { useQuery } from "react-query";

import { getParticipants } from "@common/api/index";
import { useUIConfig } from "@common/config-provider";

type Participant = {
    __key: string;
    __label: string;
    __cohort?: string;
};

export default function useParticipants() {
    const uiConfig = useUIConfig();
    return useQuery<Participant[], any>("participants", () =>
        getParticipants(uiConfig?.api_url)
    );
}
