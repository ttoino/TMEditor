import React from "react";
import { useQuery } from "react-query";

import { styled } from "@common/theme";
import { getConfig } from "@common/api";
import LoadingIndicator from "@common/components/LoadingIndicator";
import { useUIConfig } from "@common/config-provider";
import useParticipants from "@common/hooks/useParticipants";
import Card from "@common/components/Card";

const DatabaseContainer = () => {
    const uiConfig = useUIConfig();
    const { data, isLoading, error } = useParticipants();
    const { data: config } = useQuery("config", () =>
        getConfig(uiConfig?.api_url)
    );

    if (error?.response?.status === 404) {
        return (
            <ErrorContainer>
                <ImageContainer>
                    <img src={"../assets/ic_error.png"} alt="" width={24} />
                </ImageContainer>
                <div>{error.response.data}</div>
            </ErrorContainer>
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
            <StyledTitle>{data.title}</StyledTitle>

            <Card>
                <pre>{JSON.stringify(config, undefined, 4)}</pre>
            </Card>
        </Wrapper>
    );
};

export default DatabaseContainer;

const Wrapper = styled("div", {
    padding: "$2",
});

const StyledTitle = styled("h1", {
    marginBottom: "$4",
    fontSize: "1.8rem",
});

const LoadingContainer = styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
});

const ImageContainer = styled("div", {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: "50%",
    backgroundColor: "$errorA10",
    marginBottom: "$1",
});

const ErrorContainer = styled("div", {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "menlo, monospace",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 1.4,
});
