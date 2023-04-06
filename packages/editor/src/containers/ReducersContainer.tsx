import React from "react";

import Card from "@common/components/Card";
import useReducers from "@app/hooks/useReducers";
import ErrorCard from "@common/components/ErrorCard";
import { styled } from "@common/theme";
import LoadingIndicator from "@common/components/LoadingIndicator";

const ReducersContainer = () => {
    const { state, update, sync } = useReducers();
    const { data: reducers, error, isLoading } = state;

    if (error) {
        return (
            <Wrapper>
                <ErrorCard error={error} />
            </Wrapper>
        );
    }

    if (isLoading) {
        return (
            <LoadingContainer>
                <LoadingIndicator />
            </LoadingContainer>
        );
    }

    return (
        <Wrapper>
            <Card>
                <textarea onInput={(e) => update((_) => e.currentTarget.value)}>
                    {reducers}
                </textarea>
                <button onClick={() => sync()}>Save</button>
            </Card>
        </Wrapper>
    );
};

export default ReducersContainer;

const Wrapper = styled("div", {
    padding: "$2",
});

const LoadingContainer = styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
});
