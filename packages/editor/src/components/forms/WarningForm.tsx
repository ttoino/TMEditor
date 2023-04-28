import React from "react";
import type { Warning } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";

interface Props {
    component: Warning;
    update: UpdateFn<Warning>;
}


export default function WarningForm({ component, update }: Props) {
    return <>
        <FormComponent
            component="input"
            label="operator"
            type="text"
            value={component.operator}
            onValueChange={updateAt(update, "operator")}
            ></FormComponent>

        <FormComponent
            component="input"
            label="threshold"
            type="number"
            value={component.threshold}
            onValueChange={updateAt(update, "threshold")}
            ></FormComponent>

    </>;
}
