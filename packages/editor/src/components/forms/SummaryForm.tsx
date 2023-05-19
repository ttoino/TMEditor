import React from "react";
import type { Summary } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import FiltersQueryForms from "./FiltersQueryForms";
import updateAt from "@app/util/updateAt";
import useConfig from "@app/hooks/useConfig";

interface Props {
    component: Summary;
    update: UpdateFn<Summary>;
}

export default function SummaryForm({ component, update }: Props) {
    const databases = useConfig().state.data?.databases.map(database => database.id);

    const updateTitle = updateAt(update, "title");
    const updatePrecision = (value: any) => updateAt(update, "precision")(parseInt(value));

    return (
        <>
            <FormComponent
                component="input"
                label="Title"
                value={component.title}
                onValueChange={updateTitle}
                required
            >
            </FormComponent>

            <FormComponent
                component="select"
                label="Database"
                value={component.query?.database}
                onValueChange={updateAt(update, "component.query.database")}
                required
            >
                {databases?.map(database => 
                    <option value={database}>{database}</option>)
                };
            </FormComponent>
            

            <FormComponent
                component="input"
                label="Table"
                value={component.query?.table}
                onValueChange={updateAt(update, "component.query.table")}
                required
            >
            </FormComponent>

            {/*TODO: Add fields input*/}

            <FormComponent
                component="input"
                label="Group by"
                value={component.query?.groupby}
                onValueChange={updateAt(update, "component.query.groupby")}
            >
            </FormComponent>

            <FiltersQueryForms
                filters={component.query?.filters ?? {}}
                update={updateAt(update, "component.query.filters")}
            ></FiltersQueryForms>

            {/*TODO: Add include input*/}
            

            <FormComponent
                component="input"
                label="Reducer"
                value={component.reducer}
                onValueChange={updateAt(update, "component.reducer")}
            >
            </FormComponent>

            <FormComponent
                component="input"
                type="number"
                label="Precision"
                value={component.precision}
                onValueChange={updatePrecision}
            >
            </FormComponent>

        </>
    );
}
