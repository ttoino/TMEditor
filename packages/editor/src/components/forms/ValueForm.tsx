import React from "react";
import type { Value } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";

interface Props {
    component: Value;
    update: UpdateFn<Value>;
}


export default function ValueForm({ component, update }: Props) {
    return <>
        <FormComponent
            component="input"
            label="Title"
            type="text"
            value={component.title}
            onValueChange={updateAt(update, "title")}
            ></FormComponent>

        <FormComponent
            component="input"
            label="Precision"
            type="number"
            value={component.precision}
            onValueChange={updateAt(update, "precision")}
            ></FormComponent>
    </>;
}
