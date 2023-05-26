import React from "react";
import type { Value } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Value;
    update: UpdateFn<Value>;
}

export default function ValueForm({ component, update }: Props) {
    return <></>;
}
