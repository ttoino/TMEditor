import React from "react";
import type { Summary } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Summary;
    update: UpdateFn<Summary>;
}

export default function SummaryForm({ component, update }: Props) {
    return <></>;
}
