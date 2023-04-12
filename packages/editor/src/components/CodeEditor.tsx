import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import { styled, theme } from "@common/theme";

interface Props {
    value: string;
    onValueChange: (value: string) => void;
}

function CodeEditor(props: Props) {
    return (
        <Editor
            padding={theme.space[0].value}
            highlight={(code) => highlight(code, languages.js, "js")}
            {...props}
        ></Editor>
    );
}

export default styled(CodeEditor, {
    fontFamily: "monospace",
    fontSize: "$body",
    borderColor: "$neutral20",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "$card",
    transition: "$hover",

    "&:focus-within": {
        borderColor: "$primary",
        borderWidth: "2px",
    },

    ".token.comment, .token.prolog, .token.doctype, .token.cdata": {
        color: "$neutral30",
    },

    ".token.punctuation": {
        color: "$neutral20",
    },

    ".token.namespace": {
        color: "$neutral20",
    },

    ".token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted, .token.function, .token.class-name":
        {
            color: "$error",
        },

    ".token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted":
        {
            color: "#758e4f",
        },

    ".token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string, .token.regex, .token.important, .token.variable":
        {
            color: "#f6ae2d",
        },

    ".token.atrule, .token.attr-value, .token.keyword": {
        color: "$primary",
    },

    ".token.important, .token.bold": {
        fontWeight: "bold",
    },
    ".token.italic": {
        fontStyle: "italic",
    },

    ".token.entity": {
        cursor: "help",
    },
});
