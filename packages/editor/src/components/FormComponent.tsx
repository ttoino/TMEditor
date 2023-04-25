import React, { useId } from "react";
import { styled } from "@common/theme";
import { CSS } from "@stitches/react";

type ComponentType = "input" | "select" | "textarea";

type Props<C extends ComponentType> = React.ComponentPropsWithoutRef<C> & {
    component: C;
    label: string;
    hideLabel?: boolean;
    onValueChange?: (value: string) => unknown;
    labelProps?: React.ComponentPropsWithoutRef<"label">;
    css?: CSS;
};

export default function FormComponent<C extends ComponentType>({
    component,
    label,
    hideLabel,
    labelProps,
    onValueChange,
    ...rest
}: Props<C>) {
    const defaultId = useId();
    const defaultOnChange: NonNullable<typeof rest.onChange> = (e) =>
        onValueChange?.(e.currentTarget.value);

    rest.onChange ??= defaultOnChange;
    rest.id ??= defaultId;

    const StyledComponent = styledComponents[component];
    const Label = hideLabel ? HiddenLabel : StyledLabel;

    return (
        <Wrapper>
            <Label htmlFor={rest.id} {...labelProps}>
                {label}
            </Label>
            <StyledComponent {...rest} />
        </Wrapper>
    );
}

const Wrapper = styled("div", {
    display: "flex",
    flexDirection: "row",
    gap: "$1",
    alignItems: "start",
});

const StyledLabel = styled("label", {
    flexBasis: "30%",
    flexShrink: "1",
    flexGrow: "0",
    maxWidth: "10em",
    paddingBlock: "$0",
});
const HiddenLabel = styled("label", {
    opacity: "0",
    position: "absolute",
    pointerEvents: "none",
    userSelect: "none",
    clip: "rect(0 0 0 0)",
});

const componentStyle = {
    flex: 1,
    paddingInline: "$1",
    paddingBlock: "$0",
    fontSize: "1em",
    fontFamily: "$sans",
    borderRadius: "0.3em",
    border: "1px solid $neutral50",
    backgroundColor: "$primaryTintHover",
    outline: "none",
    flexGrow: "1",
    boxSizing: "border-box",
    transition: "$hover",
    accentColor: "$primary",
    caretColor: "$primary",
    color: "$text",

    "&:is(textarea)": {
        resize: "vertical",
        minHeight: "2em",
    },

    "&:focus": {
        border: "1px solid $primary",
    },

    "&:disabled": {
        backgroundColor: "$neutral50",
        color: "$neutral30",
        cursor: "unset",
    },
};
const styledComponents: Record<ComponentType, ReturnType<typeof styled>> = {
    input: styled("input", componentStyle),
    select: styled("select", componentStyle),
    textarea: styled("textarea", componentStyle),
};
