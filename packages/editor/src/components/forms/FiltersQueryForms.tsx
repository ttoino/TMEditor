import React from "react";
import type { FiltersQuery } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import DatabaseContainer from "@app/containers/DatabaseContainer";
import FiltersQueryForm from "./FiltersQueryForm";



interface Props {
    filters: FiltersQuery[] | {};
    update: UpdateFn<FiltersQuery[]> | {};
}

export default function FiltersQueryForms({ filters, update }: Props) {
    return <>
        {

            Object.entries(filters ?? {}).map(([key, filter]) => (
                <>

                <FiltersQueryForm
                    component={filter}
                    update={updateAt(update as UpdateFn<FiltersQuery[]>, key)}
                ></FiltersQueryForm>

                </>

            ))
        }
    </>;
}

