import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import IconButton from "./IconButton";
import Dialog, { DialogTitle } from "./Dialog";
import FormComponent from "./FormComponent";
import Button from "./Button";
import { MutationFunction, MutationKey, useMutation } from "react-query";
import { putPage, putConfig } from "@app/api";
import { useNavigate } from "react-router-dom";
import { MainConfig } from "@types";

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
            <IconButton onClick={() => setOpen(true)}>
                <MdAdd />
            </IconButton>

            <Dialog open={open} onCancel={() => setOpen(false)}>
                <DialogTitle>New {item}</DialogTitle>

                {children}

                <Button
                    disabled={mutation.isLoading}
                    onClick={() => mutation.mutate(undefined)}
                >
                    Create {item}
                </Button>
            </Dialog>
        </>
    );
};

export const NewPage = () => {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");

    const createPage = async () => putPage(slug, { title, components: [] });

    return (
        <Common
            item="page"
            url={`/pages/${slug}`}
            mutationKey={["page", slug]}
            mutationFn={createPage}
        >
            <FormComponent
                component="input"
                type="text"
                label="Page Title"
                value={title}
                onValueChange={setTitle}
                required
            />

            <FormComponent
                component="input"
                type="text"
                label="Page Slug"
                value={slug}
                onValueChange={setSlug}
                required
                pattern="^\w+$"
                maxLength={100}
            />
        </Common>
    );
};

export const NewConnector = ({ config }: { config: MainConfig }) => {
    const [id, setId] = useState("");

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
            />
        </Common>
    );
};
