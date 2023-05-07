import React from "react";
import type { Value } from "@types";
import FormComponent from "../FormComponent";
import WarningsForm from "./WarningsForm";
import updateAt from "@app/util/updateAt";
import FormProps from "./FormProps";

export default function ValueForm({ component, update }: FormProps<Value>) {
    return (
        <>
            <FormComponent
                component="input"
                label="Title"
                type="text"
                required
                value={component?.title}
                onValueChange={updateAt(update, "title")}
            />

            <FormComponent
                component="input"
                label="Precision"
                type="number"
                min="0"
                step="1"
                value={component?.precision}
                onValueChange={updateAt(update, "precision")}
            />

            <WarningsForm
                warnings={component?.warnings ?? {}}
                update={updateAt(update, "warnings")}
            />
        </>
    );
}
