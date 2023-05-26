import React from "react";
import type { Columns } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Columns;
    update: UpdateFn<Columns>;
}

export default function ColumnsForm({ component, update }: Props) {
    return <></>;
}
