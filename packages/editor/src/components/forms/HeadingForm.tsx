import React from "react";
import type { Heading } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";

interface Props {
    component: Heading;
    update: UpdateFn<Heading>;
}

export default function HeadingForm({ component, update }: Props) {
    return <></>;
}
