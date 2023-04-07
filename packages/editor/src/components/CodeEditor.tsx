import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

interface Props {
    value: string;
    onValueChange: (value: string) => void;
}

export default function CodeEditor(props: Props) {
    // return <textarea onChange={(e) => props.onValueChange(e.currentTarget.value)}>{props.value}</textarea>;
    // return <textarea onChange={(e) => props.onValueChange(e.currentTarget.value)} value={props.value}></textarea>;

    return <Editor highlight={code => highlight(code, languages.js, "js")} {...props}></Editor>;
}
