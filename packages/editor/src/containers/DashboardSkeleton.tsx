import { getConfig } from "@common/api";
import LoadingIndicator from "@common/components/LoadingIndicator";
import { useUIConfig } from "@common/config-provider";
import Sidebar from "@common/components/Sidebar";
import React from "react";
import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";
import { styled } from "@common/theme";

export default function DashboardSkeleton() {
    const uiConfig = useUIConfig();
    const { isLoading, error, data } = useQuery("config", () =>
        getConfig(uiConfig?.api_url)
    );

    if (isLoading) {
        return (
            <WrapperSpinner>
                <LoadingIndicator />
            </WrapperSpinner>
        );
    }

    if (error || !data) {
        return (
            <ErrorContainer>
                <ImageContainer>
                    <img src={"../assets/ic_error.png"} alt="" width={24} />
                </ImageContainer>

                <ErrorBox>
                    There was a problem connecting to Trial Monitor API
                </ErrorBox>
            </ErrorContainer>
        );
    }

    return (
        <Wrapper>
            <Sidebar pages={data.pages} />
            <Main>
                <Outlet />
            </Main>
        </Wrapper>
    );
}

const Wrapper = styled("div", {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    minHeight: "100vh",
    backgroundColor: "$neutral50",
});

const Main = styled("div", {
    overflow: "hidden",
});

const WrapperSpinner = styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "$neutral50",
});

const ErrorContainer = styled("div", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    height: "100vh",
    marginTop: -50,
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

const ErrorBox = styled("p", {
    maxWidth: 500,
    padding: "$1",
    margin: 0,
    marginTop: "$2",
    backgroundColor: "$errorA10",
    fontFamily: "menlo, monospace",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 1.4,
});
