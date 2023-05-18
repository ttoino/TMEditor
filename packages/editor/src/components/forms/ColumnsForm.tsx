import React from "react";
import type { Columns } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import { styled } from "@common/theme";
import ComponentList from "../ComponentList";
import updateAt from "@app/util/updateAt";
import IconButton from "../IconButton";
import { MdAdd } from "react-icons/md";
import appendAt from "@app/util/appendAt";

interface Props {
    component: Columns;
    update: UpdateFn<Columns>;
}

export default function ColumnsForm({ component, update }: Props) {
    return (
        <>
            <StyledListTitle>
                Children
                <IconButton
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
                </IconButton>
            </StyledListTitle>

            <Wrapper>
                <ComponentList
                    components={component.components}
                    update={updateAt(update, "components")}
                />
            </Wrapper>
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
});
