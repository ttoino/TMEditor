import React from "react";
import type { Table } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Table;
    update: UpdateFn<Table>;
}

export default function TableForm({ component, update }: Props) {
    return <></>;
}
