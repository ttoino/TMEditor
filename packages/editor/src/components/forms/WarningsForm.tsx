import React from "react";
import type { Warning } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import DatabaseContainer from "@app/containers/DatabaseContainer";
import WarningForm from "./WarningForm";


interface Props {
    warnings: Record<string, Warning>;
    update: UpdateFn<Record<string, Warning>>;
}

export default function WarningsForm({ warnings, update }: Props) {
    return <>
        {

            Object.entries(warnings ?? {}).map(([key, warning]) => (
                <>
                <FormComponent
                    component="input"
                    label="Warning Key"
                    type="text"
                    value={key}
                    onValueChange={updateAt(update, "key")}
                ></FormComponent>
                
                <WarningForm
                    key={key}
                    component={warning}
                    update={updateAt(update, key)}
                ></WarningForm>
                </>

            ))
        }
    </>;
}
