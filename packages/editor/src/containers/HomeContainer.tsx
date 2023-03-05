import React from "react";
import { useQuery } from "react-query";

import LoadingIndicator from "@common/components/LoadingIndicator";
import Card from "@common/components/Card";
import ErrorCard from "@common/components/ErrorCard";
import { getConfig } from "@common/api";
import { styled } from "@common/theme";
import { useUIConfig } from "@common/config-provider";
import useParticipants from "@common/hooks/useParticipants";

const HomeContainer = () => {
    const uiConfig = useUIConfig();
    const { data, isLoading, error } = useParticipants();
    const { data: config } = useQuery("config", () =>
        getConfig(uiConfig?.api_url)
    );

    if (error) {
        return (
            <Wrapper>
                <ErrorCard error={error} />
            </Wrapper>
        );
    }

    if (isLoading || !data) {
        return (
            <LoadingContainer>
                <LoadingIndicator />
            </LoadingContainer>
        );
    }

    return (
        <Wrapper>
            <Card>
                <pre>{JSON.stringify(config, undefined, 4)}</pre>
            </Card>
        </Wrapper>
    );
};

export default HomeContainer;

const Wrapper = styled("div", {
    padding: "$2",
});

const LoadingContainer = styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
});
