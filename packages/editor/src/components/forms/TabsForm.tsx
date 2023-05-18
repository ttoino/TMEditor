import React from "react";
import type { Tabs } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import TabsPanelForm from "./TabsPanelForm";
import updateAt from "@app/util/updateAt";
import { styled } from "@common/theme";
import { MdAdd } from "react-icons/md";
import IconButton from "../IconButton";
import appendAt from "@app/util/appendAt";

interface Props {
    component: Tabs;
    update: UpdateFn<Tabs>;
}

export default function TabsForm({ component, update }: Props) {
    return (
        <>
            <StyledListTitle>
                Panels
                <IconButton
                    onClick={() =>
                        appendAt(
                            update,
                            "panels"
                        )({
                            _open: true,
                        })
                    }
                >
                    <MdAdd />
                </IconButton>
            </StyledListTitle>

            {component.panels?.map((panel, index) => (
                <TabsPanelForm
                    key={index}
                    component={panel}
                    update={updateAt(update, `panels.${index}`)}
                />
            ))}
        </>
    );
}

const StyledListTitle = styled("div", {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "$1",
});
