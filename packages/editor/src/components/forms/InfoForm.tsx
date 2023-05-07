import React from "react";
import type { Info } from "@types";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import FormProps from "./FormProps";

export default function InfoForm({ component, update }: FormProps<Info>) {
    return (
        <>
            <FormComponent
                component="input"
                label="Title"
                required
                value={component?.title}
                onValueChange={updateAt(update, "title")}
            />

            <FormComponent
                component="textarea"
                label="Text"
                required
                value={component?.text}
                onValueChange={updateAt(update, "text")}
            />
        </>
    );
}
