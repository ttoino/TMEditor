import React from "react";
import type { UIComponent } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import updateAt from "@app/util/updateAt";
import FormComponent from "../FormComponent";
import ChartForm from "./ChartForm";
import ColumnsForm from "./ColumnsForm";
import HeadingForm from "./HeadingForm";
import InfoForm from "./InfoForm";
import SummaryForm from "./SummaryForm";
import TableForm from "./TableForm";
import TabsForm from "./TabsForm";
import ValueForm from "./ValueForm";

interface Props {
    component: UIComponent;
    update: UpdateFn<UIComponent>;
}

const forms = {
    chart: ChartForm,
    columns: ColumnsForm,
    heading: HeadingForm,
    info: InfoForm,
    summary: SummaryForm,
    table: TableForm,
    tabs: TabsForm,
    value: ValueForm,
} as const;

export default function ComponentForm({ component, update }: Props) {
    const updateType = updateAt(update, "type");

    const ChildForm = forms[component.type];

    return (
        <>
            <FormComponent
                component="select"
                label="Type"
                value={component.type}
                onValueChange={updateType}
            >
                <option value="chart">Chart</option>
                <option value="columns">Columns</option>
                <option value="heading">Heading</option>
                <option value="info">Info</option>
                <option value="summary">Summary</option>
                <option value="table">Table</option>
                <option value="tabs">Tabs</option>
                <option value="value">Value</option>
            </FormComponent>

            {/* @ts-ignore */}
            <ChildForm component={component} update={update} />
        </>
    );
}
