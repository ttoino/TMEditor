import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { styled } from "@common/theme";
import LoadingIndicator from "@common/components/LoadingIndicator";
import useConfig from "@app/hooks/useConfig";
import Card from "@common/components/Card";
import ConnectorForm from "@app/components/ConnectorForm";
import FormComponent from "@app/components/FormComponent";
import updateAt from "@app/util/updateAt";

const DatabaseContainer = () => {
    const { database } = useParams();
    const { state, update } = useConfig();
    const { data, isLoading, error } = state;

    let index;
    for (var i in data.databases) {
        if (data.databases[i].id === database) {
            index = i;
            break;
        }
    }
    let db = data.databases[index];

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
            <FormComponent
                label="Id"
                hideLabel
                component="input"
                type="text"
                value={db.id}
                css={{ fontSize: "1.5em", fontWeight: "500" }}
            />
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
