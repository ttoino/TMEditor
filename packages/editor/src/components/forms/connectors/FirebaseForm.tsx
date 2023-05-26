import React from "react";
import type { DBConfigFirebase } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../../FormComponent";

interface Props {
    component: DBConfigFirebase;
    update: UpdateFn<DBConfigFirebase>;
}

export default function FirebaseForm({ component, update }: Props) {
    return <></>;
}
