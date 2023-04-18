import { styled } from "@common/theme";

export default styled("button", {
    display: "inline-flex",
    background: "none",
    border: "none",
    margin: "0",
    padding: "0",
    lineHeight: "1",
    fontSize: "24px",
    borderRadius: "50%",
    transition: "$hover",
    cursor: "pointer",
    boxSizing: "border-box",
    width: "1.5em",
    height: "1.5em",
    placeItems: "center",
    placeContent: "center",

    "&:hover": {
        backgroundColor: "$primaryTintHover",
        color: "$primary",
    },

    "&:active": {
        backgroundColor: "$primaryTint",
    },

    "&:focus": {
        outline: "none",
        border: "1px solid $primary",
        color: "$primary",
    },

    "&:disabled": {
        cursor: "unset",
        color: "$neutral30",
        background: "none",
    },
});
