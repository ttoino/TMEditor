import React from "react";
import type { IncludeQuery } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import DatabaseContainer from "@app/containers/DatabaseContainer";
import FiltersQueryForms from "./FiltersQueryForms";
import { styled } from '@common/theme';

interface Props {
    component: IncludeQuery;
    update: UpdateFn<IncludeQuery>;
}

export default function IncludeForm({ component, update }: Props) {
    return <>
    <StyleInclude>
        <FormComponent
            component="input"
            label="Table"
            value={component.table}
            onValueChange={updateAt(update, "table")}
            required
        >
        </FormComponent>
    </StyleInclude>

    <StyleInclude>
        <FormComponent
            component="input"
            label="Fields(comma separeted)"
            value={component.fields?.join(', ')}
            onValueChange={(value: any) => updateAt(update, "fields")(value.replace(/\s/g, '').split(','))}
        >
        </FormComponent>
    </StyleInclude>

    <StyleInclude>
        <FiltersQueryForms
            filters={component.filters ?? {}}
            update={updateAt(update, "filters")}
        ></FiltersQueryForms>
    </StyleInclude>
    

    </>;
}

const StyleInclude = styled('div', {
    marginLeft: "$4",
    gap: '$1'
  })
  