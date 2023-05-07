import React from "react";
import type { Chart } from "@types";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import SpecForm from "./chart/SpecForm";
import FormProps from "./FormProps";

export default function ChartForm({ component, update }: FormProps<Chart>) {
    return (
        <>
            <FormComponent
                label="Title"
                component="input"
                required
                value={component?.title}
                onValueChange={updateAt(update, "title")}
            />

            <SpecForm spec={component?.spec} update={updateAt(update, "spec")} />
        </>
    );
}
