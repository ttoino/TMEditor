import React from "react";
import { useParams } from "react-router-dom";

import { styled } from "@common/theme";
import LoadingIndicator from "@common/components/LoadingIndicator";
import usePageConfig from "@app/hooks/usePageConfig";
import updateAt from "@app/util/updateAt";
import FormComponent from "@app/components/FormComponent";
import ComponentList from "@app/components/ComponentList";
import SaveButton from "@app/components/SaveButton";
import appendAt from "@app/util/appendAt";
import Button from "@app/components/Button";
import { MdAdd } from "react-icons/md";

const PageContainer = () => {
    const { page } = useParams();
    const { state, update, updated, sync, syncing } = usePageConfig(page);
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
            <TitleWrapper>
                <FormComponent
                    label="Title"
                    hideLabel
                    component="input"
                    type="text"
                    value={data.title}
                    onValueChange={updateTitle}
                    css={{ fontSize: "1.5em", fontWeight: "500" }}
                />

                <Button
                    onClick={() =>
                        appendAt(
                            update,
                            "components"
                        )({
                            // @ts-ignore
                            _open: true,
                            type: "heading",
                            title: "",
                        })
                    }
                >
                    <MdAdd />
                    New component
                </Button>

                <SaveButton sync={sync} syncing={syncing} updated={updated} />
            </TitleWrapper>

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

const TitleWrapper = styled("div", {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "$1",
    position: "sticky",
    margin: "-$2",
    padding: "$2",
    background: "$neutral50",
    top: 0,

    "& > :first-child": {
        flex: 1,
    },
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
