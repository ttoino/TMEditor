import { styled } from "@common/theme";

export default styled("button", {
    display: "inline-flex",
    paddingBlock: "$1",
    paddingInline: "$2",
    fontSize: "1em",
    border: "none",
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
});
