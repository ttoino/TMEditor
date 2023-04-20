import React from "react";
import type { Chart } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Chart;
    update: UpdateFn<Chart>;
}

export default function ChartForm({ component, update }: Props) {
    return <></>;
}
