import React from "react";
import type { Info } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Info;
    update: UpdateFn<Info>;
}

export default function InfoForm({ component, update }: Props) {
    return <></>;
}
