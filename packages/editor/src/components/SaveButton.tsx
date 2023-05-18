import React from "react";
import Button from "./Button";
import { MdSave } from "react-icons/md";
import LoadingIndicator from "@common/components/LoadingIndicator";

interface Props extends React.ComponentProps<typeof Button> {
    syncing: boolean;
    updated: boolean;
    sync: () => void;
}

export default function SaveButton({ sync, syncing, updated, ...rest }: Props) {
    return (
        <Button
            disabled={!updated || syncing}
            onClick={(e) => {
                sync();
                rest.onClick?.(e);
            }}
            {...rest}
        >
            {syncing ? <LoadingIndicator size={16} /> : <MdSave />} Save
        </Button>
    );
}
