import React from "react";
import type { FiltersQuery } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import DatabaseContainer from "@app/containers/DatabaseContainer";
import { styled } from '@common/theme';

interface Props {
    component: FiltersQuery;
    update: UpdateFn<FiltersQuery>;
}

export default function FiltersQueryForm({ component, update }: Props) {
    return <>
    <StyleFiltersQuery>
        <FormComponent
            component="input"
            label="Target"
            value={component.target}
            onValueChange={updateAt(update, "target")}
        >
        </FormComponent>
    </StyleFiltersQuery>

    <StyleFiltersQuery>
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
    </StyleFiltersQuery>

    <StyleFiltersQuery>
        <FormComponent
            component="input"
            label="Value"
            type="number"
            value={component.value}
            onValueChange={updateAt(update, "value")}
        ></FormComponent>
    </StyleFiltersQuery>

    </>;
}

const StyleFiltersQuery = styled('div', {
    marginLeft: "$4",
    gap: '$1'
  })
  