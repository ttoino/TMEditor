import React from "react";
import type { Warnings } from "@types";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import WarningForm from "./WarningForm";
import FormProps from "./FormProps";

export default function WarningsForm({
    warnings,
    update,
}: FormProps<Warnings, "warnings">) {
    return (
        <>
            {Object.entries(warnings ?? {}).map(([key, warning]) => (
                <React.Fragment key={key}>
                    <FormComponent
                        component="input"
                        label="Warning field"
                        type="text"
                        required
                        value={key}
                        onValueChange={updateAt(update, "key")}
                    />

                    <WarningForm
                        warning={warning}
                        update={updateAt(update, key)}
                    />
                </React.Fragment>
            ))}
        </>
    );
}
