import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { keyframes } from "@stitches/react";

import type { Warning } from "@types";
import { styled } from "@common/theme";
import useWarning from "@common/hooks/useWarning";

interface Props {
    warning?: Warning;
    value: number;
    size?: "large";
}

export default function WarningIndicator({ warning, value, size }: Props) {
    const [showWarning, symbol] = useWarning(value, warning);

    if (!warning?.operator) {
        return null;
    }

    return (
        <TooltipPrimitive.Root delayDuration={400}>
            <OperatorStyled size={size} warning={showWarning}>
                {symbol}
            </OperatorStyled>
            <StyledContent avoidCollisions={true} collisionTolerance={10}>
                <StyledHeader>Alert</StyledHeader>
                <StyledInfoRow>
                    <dt>Threshold: </dt>
                    <StyledValue>{warning.threshold}</StyledValue>
                </StyledInfoRow>
                <StyledInfoRow>
                    <dt>Operator: </dt>
                    <StyledValue>{symbol}</StyledValue>
                </StyledInfoRow>
                <StyledArrow />
            </StyledContent>
        </TooltipPrimitive.Root>
    );
}

const OperatorStyled = styled(TooltipPrimitive.Trigger, {
    display: "inline-block",
    backgroundColor: "$neutral50",
    color: "$neutral30",
    borderRadius: 4,
    padding: "4px 6px",
    fontWeight: 700,
    fontSize: 11,
    border: "none",
    transition: "filter 300ms",

    "&:hover": {
        filter: "brightness(0.95)",
    },

    variants: {
        warning: {
            true: {
                backgroundColor: "$error",
                color: "#fff",
            },
        },
        size: {
            large: {
                padding: "6px 10px",
                fontSize: 14,
            },
        },
    },
});

const slideUpAndFade = keyframes({
    "0%": { opacity: 0, transform: "translateY(5px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
});

const StyledContent = styled(TooltipPrimitive.Content, {
    borderRadius: "$card",
    padding: "$1",
    backgroundColor: "#fff",
    boxShadow: "$tooltip",
    fontSize: 12,
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    animationFillMode: "forwards",
    willChange: "transform, opacity",
    '&[data-state="delayed-open"]': {
        '&[data-side="bottom"]': { animationName: slideUpAndFade },
    },
});

const StyledArrow = styled(TooltipPrimitive.Arrow, {
    fill: "white",
});

const StyledHeader = styled("h3", {
    margin: 0,
    marginBottom: "$1",
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 400,
    color: "$neutral30",
});

const StyledInfoRow = styled("div", {
    marginBottom: "$0",

    "&:last-of-type": {
        marginBottom: 0,
    },

    dt: {
        display: "inline",
    },
});

const StyledValue = styled("dd", {
    display: "inline",
    fontWeight: 600,
    marginLeft: 0,
    color: "$neutral10",
});
