import React from "react";

import Card from "@common/components/Card";
import useReducers from "@app/hooks/useReducers";
import ErrorCard from "@common/components/ErrorCard";
import { styled } from "@common/theme";
import LoadingIndicator from "@common/components/LoadingIndicator";
import CodeEditor from "@app/components/CodeEditor";

const ReducersContainer = () => {
    const { state, update, updated, sync, syncing } = useReducers();
    const { data: reducers, error, isLoading } = state;
    // const [reducers, update] = useState("test");
    // const error = false; const isLoading = false; const updated = false; const syncing = false;
    // const sync = () => {};

    // console.log(reducers);

    if (error) {
        return (
            <Wrapper>
                <ErrorCard error={error} />
            </Wrapper>
        );
    }

    if (isLoading || reducers === undefined) {
        return (
            <LoadingContainer>
                <LoadingIndicator />
            </LoadingContainer>
        );
    }

    return (
        <Wrapper>
            <Card>
                <CodeEditor onValueChange={update} value={reducers} />
                <button disabled={!updated || syncing} onClick={() => sync()}>
                    Save
                </button>
                {syncing && <LoadingIndicator />}
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
