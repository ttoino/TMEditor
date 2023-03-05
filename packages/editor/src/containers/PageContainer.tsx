import React, { useEffect } from "react";
import { useQuery } from "react-query";
import {
    useParams,
    useSearchParams,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { styled } from "@common/theme";
import { getPage } from "@common/api";
import LoadingIndicator from "@common/components/LoadingIndicator";
import { useUIConfig } from "@common/config-provider";
import type { PageResponse } from "@types";
import Card from "@common/components/Card";

const PageContainer = () => {
    const { page } = useParams();
    const [searchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams);
    const uiConfig = useUIConfig();
    const location = useLocation();
    const navigateTo = useNavigate();

    const { data, isLoading, error } = useQuery<PageResponse, any>(
        ["page", page, params],
        () => getPage(page, searchParams, uiConfig?.api_url),
        {
            retry: false,
        }
    );

    useEffect(() => {
        if (!validateParams(params)) {
            const { startDate, endDate, ...search } = params;

            navigateTo({
                pathname: location.pathname,
                search: new URLSearchParams(search).toString(),
            });
        }
    });

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
                <pre>{JSON.stringify(data, undefined, 4)}</pre>
            </Card>
        </Wrapper>
    );
};

export default PageContainer;

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

const validateParams = (params: { [k: string]: string }) => {
    const hasStartDate = Object.prototype.hasOwnProperty.call(
        params,
        "startDate"
    );
    const hasEndDate = Object.prototype.hasOwnProperty.call(params, "endDate");
    if (hasStartDate && hasEndDate) {
        if (new Date(params.endDate) >= new Date(params.startDate)) return true;
        return false;
    } else if (hasStartDate || hasEndDate) return false;
    return true;
};
