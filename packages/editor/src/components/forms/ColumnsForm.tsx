import React from "react";
import type { Columns } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import { styled } from "@common/theme";
import ComponentList from "../ComponentList";
import updateAt from "@app/util/updateAt";
import { MdAdd } from "react-icons/md";
import appendAt from "@app/util/appendAt";
import Button from "../Button";

interface Props {
    component: Columns;
    update: UpdateFn<Columns>;
}

export default function ColumnsForm({ component, update }: Props) {
    return (
        <>
            <StyledListTitle>
                Children
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
