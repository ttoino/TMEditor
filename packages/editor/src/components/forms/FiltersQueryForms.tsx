import React from "react";
import type { FiltersQuery } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import DatabaseContainer from "@app/containers/DatabaseContainer";
import FiltersQueryForm from "./FiltersQueryForm";



interface Props {
    filters: Record<string, FiltersQuery>;
    update: UpdateFn<Record<string, FiltersQuery>>;
}

export default function FiltersQueryForms({ filters, update }: Props) {
    return <>
        {

            Object.entries(filters ?? {}).map(([key, filter]) => (
                <>
                <FormComponent
                    component="input"
                    label="Filters Query"
                    type="text"
                    value={key}
                    onValueChange={updateAt(update, "key")}
                ></FormComponent>

                <FiltersQueryForm
                    key={key}
                    component={filter}
                    update={updateAt(update, key)}
                ></FiltersQueryForm>

                </>

            ))
        }
    </>;
}

