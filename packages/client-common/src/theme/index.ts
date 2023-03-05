import { createStitches } from "@stitches/react";

export const { styled, css, theme } = createStitches({
    theme: {
        colors: {
            neutral10: "#464646",
            neutral20: "#767676",
            neutral30: "#A7A7A7",
            neutral40: "#e2e2e2",
            neutral50: "#F7F7F7",
            primary: "#007EB2",
            primaryTint: "#F2F5F8",
            primaryTintHover: "#e5ecf3",
            textMenuActive: "$neutral10",
            textMenuHover: "$neutral10",
            error: "#D01027",
            errorA10: "#FAE7E9",
            errorA05: "#FDF3F4",
            surface: "#ffffff",
            text: "$neutral10",
            textMenu: "$neutral10",
        },
        space: {
            0: "4px",
            1: "8px",
            2: "16px",
            3: "24px",
            4: "32px",
        },
        fontSizes: {
            xsmall: "0.8rem",
            small: "0.9rem",
            medium: "1rem",
        },
        fonts: {
            body: "Roboto, sans-serif",
        },
        fontWeights: {},
        lineHeights: {},
        letterSpacings: {},
        sizes: {},
        borderWidths: {},
        borderStyles: {},
        radii: {
            card: "4px",
            button: "8px",
        },
        shadows: {
            card: "0 1px 0 1px rgba(0,0,0,0.05)",
            tooltip:
                "hsl(206 22% 7% / 30%) 0px 10px 26px -10px, hsl(206 22% 7% / 20%) 0px 8px 10px -10px",
        },
        zIndices: {},
        transitions: {
            hover: "all 300ms ease",
        },
    },
    media: {
        bp1: "(min-width: 768px)",
        bp2: "(min-width: 1024px)",
        bp3: "(min-width: 1440px)",
    },
});
