import React from "react";
import type { Warning } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import DatabaseContainer from "@app/containers/DatabaseContainer";


interface Props {
    component: Warning;
    update: UpdateFn<Warning>;
}

export default function WarningForm({ component, update }: Props) {
    return <>
        <FormComponent
            component="select"
            label="Operator"
            value={component.operator}
            onValueChange={updateAt(update, "operator")}
            >
                <option title="equal to" value="==">=</option>
                <option title="different from" value="!=">≠</option>
                <option title="greater than" value=">">&#62;</option>
                <option title="less than" value="<">&#60;</option>
                <option title="less than or equal to" value="<=">≤</option>
                <option title="greater than or equal to" value=">=">≥</option>

            </FormComponent>

        <FormComponent
            component="input"
            label="Threshold"
            type="number"
            value={component.threshold}
            onValueChange={updateAt(update, "threshold")}
            ></FormComponent>

    </>;
}
