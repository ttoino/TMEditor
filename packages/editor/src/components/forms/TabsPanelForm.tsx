import React, { useState } from "react";
import type { TabsPanel } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import { styled } from "@common/theme";
import ComponentList from "../ComponentList";
import { MdAdd, MdExpandLess, MdExpandMore } from "react-icons/md";
import appendAt from "@app/util/appendAt";
import Button from "../Button";

interface Props {
    component: TabsPanel;
    update: UpdateFn<TabsPanel>;
}

export default function TabsPanelForm({ component, update }: Props) {
    // @ts-ignore
    const [open, setOpen] = useState(component._open);

    // @ts-ignore
    delete component._open;

    return (
        <>
            <StyledListTitle>
                <FormComponent
                    component="input"
                    label="Label"
                    value={component.label}
                    onValueChange={updateAt(update, "label")}
                    required
                />

                {open && (
                    <Button
                        icon
                        onClick={() =>
                            appendAt(
                                update,
                                "components"
                            )({
                                _open: true,
                                type: "heading",
                            })
                        }
                    >
                        <MdAdd />
                    </Button>
                )}

                <Button
                    icon
                    onClick={() => {
                        setOpen(!open);
                    }}
                >
                    {open ? <MdExpandLess /> : <MdExpandMore />}
                </Button>
            </StyledListTitle>

            {open && (
                <Wrapper>
                    <ComponentList
                        components={component.components}
                        update={updateAt(update, "components")}
                    />
                </Wrapper>
            )}
        </>
    );
}

const Wrapper = styled("div", {
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
    gap: "$1",

    "& > *": {
        flex: 1,
    },
});

const StyledListTitle = styled("div", {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "$1",

    "& > :first-child": {
        flex: 1,
    },
});
