import React from "react";
import type { Info } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";

interface Props {
    component: Info;
    update: UpdateFn<Info>;
}

export default function InfoForm({ component, update }: Props) {
    const updateTitle = updateAt(update, "title");
    const updateText = updateAt(update, "text");

    return (
        <>
            <FormComponent
                component="input"
                label="Title"
                value={component.title}
                onValueChange={updateTitle}
            >
            </FormComponent>

            <FormComponent
                component="textarea"
                label="Text"
                value={component.text}
                onValueChange={updateText}
            >
            </FormComponent>

        </>
    );
}