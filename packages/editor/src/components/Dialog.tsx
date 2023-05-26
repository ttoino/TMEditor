import React, { useLayoutEffect, useRef, useCallback } from "react";
import { styled } from "@common/theme";
import { keyframes } from "@stitches/react";
import { createPortal } from "react-dom";

type Props = React.ComponentProps<"dialog">;

const Dialog = ({ open, onCancel, ...props }: Props) => {
    const dialog = useRef<HTMLDialogElement>(null);

    const myOnCancel = useCallback<typeof onCancel & {}>(
        (e) => {
            e.preventDefault();
            onCancel?.(e);
        },
        [onCancel]
    );

    const close = useCallback(() => {
        console.log("close");
        dialog.current
            ?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out" })
            .addEventListener("finish", () => dialog.current?.close());
    }, [dialog]);

    useLayoutEffect(
        () => (open ? dialog.current?.showModal() : close()),
        [dialog, open, close]
    );

    return createPortal(
        <dialog ref={dialog} onCancel={myOnCancel} {...props} />,
        document.body
    );
};

const open = keyframes({ "0%": { opacity: 0 }, "100%": { opacity: 1 } });

export default styled(Dialog, {
    borderRadius: "$card",
    boxShadow: "$card",
    padding: "$2",
    margin: "auto",
    border: "none",
    maxWidth: "480px",
    width: "100%",
    flexDirection: "column",
    gap: "$2",
    animation: `${open} 200ms ease-in-out`,

    "&[open]": {
        display: "flex",
    },
});

export const DialogTitle = styled("h2", {
    margin: 0,
    fontSize: "1.5em",
    fontWeight: "600",
});
