import React from "react";
import type { Tabs } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Tabs;
    update: UpdateFn<Tabs>;
}

export default function TabsForm({ component, update }: Props) {
    return <></>;
}
