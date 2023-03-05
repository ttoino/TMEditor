import React from "react";
import { Grid } from "gridjs-react";

interface Props {
    data: any[];
    columns: any[];
    pagination?: boolean | number;
    search?: boolean;
}

const DEFAULT_LIMIT = 15;

export default function TableGeneric({
    data,
    columns,
    pagination = true,
    search = true,
    ...props
}: Props) {
    return (
        <Grid
            data={data}
            columns={columns}
            search={search}
            pagination={{
                enabled: !!pagination,
                limit:
                    typeof pagination === "number" ? pagination : DEFAULT_LIMIT,
            }}
            sort={true}
            {...props}
        />
    );
}
