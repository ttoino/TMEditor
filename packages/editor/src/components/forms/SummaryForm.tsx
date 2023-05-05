import React from "react";
import type { Summary } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import useConfig from "@app/hooks/useConfig";

interface Props {
    component: Summary;
    update: UpdateFn<Summary>;
}

export default function SummaryForm({ component, update }: Props) {
    const databases = useConfig().state.data?.databases.map(database => database.id);

    const updateTitle = updateAt(update, "title");
    const updateDatabase = updateAt(update, "component.query.database");
    const updateTable = updateAt(update, "component.query.table");
    const updateGroupby = updateAt(update, "component.query.groupby");
    const updateReducer = updateAt(update, "component.reducer");
    const updatePrecision = (value: any) => updateAt(update, "precision")(parseInt(value));

    return (
        <>
            <FormComponent
                component="input"
                label="Title"
                value={component.title}
                onValueChange={updateTitle}
            >
            </FormComponent>

            <FormComponent
                component="select"
                label="Database"
                value={component.query?.database}
                onValueChange={updateDatabase}
            >
                {databases?.map(database => 
                    <option value={database}>{database}</option>)
                };
            </FormComponent>
            

            <FormComponent
                component="input"
                label="Table"
                value={component.query?.table}
                onValueChange={updateTable}
            >
            </FormComponent>

            {/*TODO: Add fields input*/}

            <FormComponent
                component="input"
                label="Group by"
                value={component.query?.groupby}
                onValueChange={updateGroupby}
            >
            </FormComponent>

            {/*TODO: Add filters input*/}

            {/*TODO: Add include input*/}

            <FormComponent
                component="input"
                label="Reducer"
                value={component.reducer}
                onValueChange={updateReducer}
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
