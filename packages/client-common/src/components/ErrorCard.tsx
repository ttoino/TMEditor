import React from "react";

import { styled } from "@common/theme";
import type { ErrorComponent } from "@types";
import Card from "./Card";

interface ErrorCardProps {
    error: ErrorComponent;
}

export default function ErrorCard({ error }: ErrorCardProps) {
    const { message, code, name } = error;
    const icon = code === "NO_PERMISSIONS" ? "ic_lock" : "ic_error";

    return (
        <Card
            css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 40,
            }}
        >
            <ImageContainer>
                <img src={`../assets/${icon}.png`} alt="" width={24} />
            </ImageContainer>

            <div>{name}</div>

            {message && <ErrorBox>{message}</ErrorBox>}
        </Card>
    );
}

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
