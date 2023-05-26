import React from "react";
import { styled } from "@common/theme";

const Button = ({ ...props }: React.ComponentProps<"button">) => {
    props.type ??= "button";

    return <button {...props} />;
};

export default styled(Button, {
    display: "inline-flex",
    paddingBlock: "$1",
    paddingInline: "$2",
    fontSize: "1em",
    border: "1px solid $neutral50",
    borderRadius: "$card",
    backgroundColor: "$surface",
    color: "$text",
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "$hover",
    placeItems: "center",
    placeContent: "center",
    gap: "$1",
    boxShadow: "$card",
    flexShrink: 0,

    "&:hover": {
        backgroundColor: "$primaryTint",
        color: "$primary",
    },

    "&:active": {
        backgroundColor: "$primaryTintHover",
    },

    "&:focus": {
        outline: "1px solid $primary",
        color: "$primary",
    },

    "&:disabled": {
        cursor: "unset",
        color: "$neutral30",
        backgroundColor: "$neutral40",
        boxShadow: "none",
    },

    variants: {
        icon: {
            true: {
                padding: 0,
                margin: 0,
                width: "1.5em",
                height: "1.5em",
                fontSize: "24px",
                borderRadius: "50%",
                background: "none",
                border: "none",
                lineHeight: "1",
                boxShadow: "none",

                "&:disabled": {
                    background: "none",
                },
            },
        },
    },
});
