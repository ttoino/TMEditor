import React from "react";
import type { DBConfigSQL } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import updateAt from "@app/util/updateAt";
import FormComponent from "../../FormComponent";

interface Props {
    component: DBConfigSQL;
    update: UpdateFn<DBConfigSQL>;
}

export default function SQLForm({ component, update }: Props) {
    return (
        <>
            <FormComponent
                component="input"
                label="Database"
                type="text"
                value={component.database}
                onValueChange={updateAt(update, "database")}
            >
            </FormComponent>

            <FormComponent
                component="input"
                label="Host"
                type="text"
                value={component.text}
                onValueChange={updateAt(update, "host")}
            >
            </FormComponent>

            <FormComponent
                component="input"
                label="Port"
                type="number"
                value={component.port}
                onValueChange={updateAt(update, "port")}
            >
            </FormComponent>

            <FormComponent
                component="select"
                label="Dialect"
                value={component.dialect}
                onValueChange={updateAt(update, "dialect")}
            >
                <option value="sqlite">SQLite</option>
                <option value="mysql">MySQL</option>
                <option value="mariadb">MariaDB</option>
                <option value="postgres">PostgreSQL</option>
                <option value="mssql">Microsoft SQL Server</option>
            </FormComponent>

            <FormComponent
                component="input"
                label="Storage"
                type="text"
                value={component.storage}
                onValueChange={updateAt(update, "storage")}
            >
            </FormComponent>

            <FormComponent
                component="input"
                label="Username"
                type="text"
                value={component.username}
                onValueChange={updateAt(update, "username")}
            >
            </FormComponent>

            <FormComponent
                component="input"
                label="Password"
                type="text"
                value={component.password}
                onValueChange={updateAt(update, "password")}
            >
            </FormComponent>

            Structure*

            <FormComponent
                component="input"
                label="Timestamp*"
                type="text"
                value={component.timestampField}
                onValueChange={updateAt(update, "timestampField")}
            >
            </FormComponent>

        </>
    );
}
