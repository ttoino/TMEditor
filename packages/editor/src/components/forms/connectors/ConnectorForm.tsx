import React from "react";
import type { DBGeneric } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import updateAt from "@app/util/updateAt";
import FormComponent from "../../FormComponent";
import SQLForm from "./SQLForm";
import FirebaseForm from "./FirebaseForm";
import FHIRForm from "./FHIRForm";

interface Props {
    component: DBGeneric;
    update: UpdateFn<DBGeneric>;
}

const forms = {
    sql: SQLForm,
    firebase: FirebaseForm,
    fhir: FHIRForm,
} as const;

export default function ConnectorForm({ component, update }: Props) {
    const updateType = updateAt(update, "type");

    const ChildForm = forms[component.type];

    return (
        <>
            <FormComponent
                component="select"
                label="Type"
                value={component.type}
                onValueChange={updateType}
            >
                <option value="sql">SQL</option>
                <option value="firebase">Firebase</option>
                <option value="fhir">FHIR</option>
            </FormComponent>

            {/* @ts-ignore */}
            <ChildForm component={component} update={update} />
        </>
    );
}
