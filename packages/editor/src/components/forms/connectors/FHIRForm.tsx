import React from "react";
import type { DBConfigFhir } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../../FormComponent";

interface Props {
    component: DBConfigFhir;
    update: UpdateFn<DBConfigFhir>;
}

export default function FHIRForm({ component, update }: Props) {
    return <></>;
}
