import React from "react";
import { useParams } from "react-router-dom";

import { styled } from "@common/theme";
import LoadingIndicator from "@common/components/LoadingIndicator";
import usePageConfig from "@app/hooks/usePageConfig";
import updateAt from "@app/util/updateAt";
import FormComponent from "@app/components/FormComponent";
import ComponentList from "@app/components/ComponentList";

const PageContainer = () => {
    const { page } = useParams();
    const { state, update } = usePageConfig(page);
    const { data, isLoading, error } = state;

    const updateTitle = updateAt(update, "title");

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
                label="Title"
                hideLabel
                component="input"
                type="text"
                value={data.title}
                onValueChange={updateTitle}
                css={{ fontSize: "1.5em", fontWeight: "500" }}
            />

            <ComponentList
                components={data.components}
                update={updateAt(update, "components")}
            />
        </Wrapper>
    );
};

export default PageContainer;

const Wrapper = styled("div", {
    padding: "$2",
    display: "flex",
    flexDirection: "column",
    gap: "$2",
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
