import React from "react";
import type { Summary } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";

interface Props {
    component: Summary;
    update: UpdateFn<Summary>;
}

export default function SummaryForm({ component, update }: Props) {
    const updateTitle = updateAt(update, "title");
    const updatePrecision = (value: any) => updateAt(update, "precision")(parseInt(value));

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
                component="input"
                type="number"
                label="Precision"
                value={component.precision}
                onValueChange={updatePrecision}
            >
            </FormComponent>

        </>
    );
}
