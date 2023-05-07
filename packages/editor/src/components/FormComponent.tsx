import React, { useId } from "react";
import { styled } from "@common/theme";
import { CSS } from "@stitches/react";

type ValueChangeHandler<T> = (value: T | undefined) => unknown;

type BaseProps = {
    label: string;
    hideLabel?: boolean;
    labelProps?: React.ComponentPropsWithoutRef<"label">;
    css?: CSS;
};

interface BaseInputProps
    extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
    component: "input";
}

interface NumberInputProps {
    type: "number" | "range";
    onValueChange?: ValueChangeHandler<number>;
}

interface BooleanInputProps {
    type: "checkbox" | "radio";
    onValueChange?: ValueChangeHandler<boolean>;
}

interface StringInputProps {
    type?: "text" | "password" | "email" | "url" | "search" | "color" | "tel";
    onValueChange?: ValueChangeHandler<string>;
}

interface DateInputProps {
    type: "date" | "datetime-local" | "month" | "time" | "week";
    onValueChange?: ValueChangeHandler<Date>;
}

interface FileInputProps {
    type: "file";
    onValueChange?: ValueChangeHandler<File>;
}

type InputProps = BaseInputProps &
    (
        | NumberInputProps
        | BooleanInputProps
        | StringInputProps
        | FileInputProps
        | DateInputProps
    );

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
    component: "select";
    children: React.ReactElement<{ value: string }>[];
    onValueChange?: ValueChangeHandler<
        this["children"][number]["props"]["value"]
    >;
}

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
    component: "textarea";
    onValueChange?: ValueChangeHandler<string>;
}

type Props = (InputProps | SelectProps | TextareaProps) & BaseProps;

export default function FormComponent(props: Props) {
    const defaultId = useId();
    const defaultOnChange = (
        e: Parameters<typeof rest.onChange & {}>[0]
    ): ReturnType<typeof rest.onChange & {}> => {
        const value = e.currentTarget.value;
        const element = e.currentTarget;

        if (value === "") {
            props.onValueChange?.(undefined);
            return;
        }

        if (
            props.component === "input" &&
            element instanceof HTMLInputElement
        ) {
            if (props.type === "number" || props.type === "range") {
                props.onValueChange?.(parseFloat(value));
            } else if (props.type === "checkbox" || props.type === "radio") {
                props.onValueChange?.(element.checked);
            } else if (
                props.type === "date" ||
                props.type === "datetime-local" ||
                props.type === "month" ||
                props.type === "time" ||
                props.type === "week"
            ) {
                props.onValueChange?.(element.valueAsDate!);
            } else if (props.type === "file") {
                props.onValueChange?.(element.files?.[0]);
            } else {
                // @ts-ignore
                props.onValueChange?.(value);
            }
        } else if (
            props.component === "select" ||
            props.component === "textarea"
        ) {
            props.onValueChange?.(value);
        }
    };

    const { component, label, hideLabel, labelProps, onValueChange, ...rest } =
        props;

    rest.onChange ??= defaultOnChange;
    rest.id ??= defaultId;

    return (
        <Wrapper>
            <StyledLabel
                htmlFor={rest.id}
                className={
                    (rest.required ? "required" : "") +
                    (hideLabel ? "hidden" : "") +
                    (rest.className ?? "")
                }
                {...labelProps}
            >
                {label}
            </StyledLabel>
            <StyledComponent as={component} {...rest} />
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
    maxWidth: "30ch",
    paddingBlock: "$0",

    "&.required::after": {
        content: " *",
        color: "$neutral20",
    },

    "&.hidden": {
        opacity: "0",
        position: "absolute",
        pointerEvents: "none",
        userSelect: "none",
        clip: "rect(0 0 0 0)",
    },
});

const StyledComponent = styled("input", {
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

    "&:invalid": {
        border: "1px solid $error",
    },
});
