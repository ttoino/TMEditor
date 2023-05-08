import React, { useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import Dialog, { DialogTitle } from "./Dialog";
import FormComponent from "./FormComponent";
import Button from "./Button";
import { MutationFunction, MutationKey, useMutation } from "react-query";
import { putPage, putConfig } from "@app/api";
import { useNavigate } from "react-router-dom";
import { MainConfig, ResponseSiteConfig } from "@types";

interface Props {
    item: string;
    mutationKey: MutationKey;
    mutationFn: MutationFunction;
    url: string;
}

const Common = ({
    item,
    mutationFn,
    mutationKey,
    url,
    children,
}: React.PropsWithChildren<Props>) => {
    const form = useRef<HTMLFormElement>(null);

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const mutation = useMutation(mutationKey, mutationFn, {
        onSuccess: () => {
            navigate(url);
            setOpen(false);
        },
    });

    return (
        <>
            <Button icon onClick={() => setOpen(true)}>
                <MdAdd />
            </Button>

            <Dialog open={open} onCancel={() => setOpen(false)}>
                <DialogTitle>New {item}</DialogTitle>

                <form ref={form} style={{ display: "contents" }}>
                    {children}
                </form>

                <Button
                    disabled={
                        mutation.isLoading ||
                        form.current?.checkValidity() === false
                    }
                    onClick={() => mutation.mutate(undefined)}
                >
                    Create {item}
                </Button>
            </Dialog>
        </>
    );
};

export const NewPage = ({
    config,
}: {
    config: MainConfig & ResponseSiteConfig;
}) => {
    const [title, setTitle] = useState("");
    const [fileName, setFileName] = useState("");

    const pattern = `^(?!(${config.pages
        .map((d) => d.fileName)
        .join("|")})$)\\w+$`;

    const createPage = async () => putPage(fileName, { title, components: [] });

    return (
        <Common
            item="page"
            url={`/pages/${fileName}`}
            mutationKey={["page", fileName]}
            mutationFn={createPage}
        >
            <FormComponent
                component="input"
                type="text"
                label="Page title"
                value={title}
                onValueChange={setTitle}
                required
            />

            <FormComponent
                component="input"
                type="text"
                label="Page file name"
                value={fileName}
                onValueChange={setFileName}
                required
                pattern={pattern}
                maxLength={100}
            />
        </Common>
    );
};

export const NewConnector = ({ config }: { config: MainConfig }) => {
    const [id, setId] = useState("");

    const pattern = `^(?!(${config.databases
        .map((d) => d.id)
        .join("|")})$)\\w+$`;

    const createConnector = () =>
        putConfig({ ...config, databases: [...config.databases, { id }] });

    return (
        <Common
            item="connector"
            url={`/databases/${id}`}
            mutationKey="config"
            mutationFn={createConnector}
        >
            <FormComponent
                component="input"
                type="text"
                label="Connector ID"
                value={id}
                onValueChange={setId}
                required
                pattern={pattern}
            />
        </Common>
    );
};
