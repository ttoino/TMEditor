import React from "react";
import type { UIComponent } from "@types";
import { UpdateFn } from "@app/hooks/useLocalState";
import Component from "./Component";
import updateAt from "@app/util/updateAt";
import deleteAt from "@app/util/deleteAt";
import Button from "./Button";
import appendAt from "@app/util/appendAt";
import { MdAdd } from "react-icons/md";
import { styled } from "@common/theme";

interface Props {
    components: UIComponent[];
    update: UpdateFn<UIComponent[]>;
}

export default function ComponentList({ components, update }: Props) {
    return (
        <>
            {components.map((component, index) => (
                <Component
                    key={index}
                    component={component}
                    update={updateAt(update, `${index}`)}
                    remove={deleteAt(update, `${index}`)}
                />
            ))}
            <StyledButton
                onClick={() =>
                    appendAt(
                        update,
                        ""
                    )({
                        type: "heading",
                        title: "",
                    })
                }
            >
                <MdAdd />
                New component
            </StyledButton>
        </>
    );
}

const StyledButton = styled(Button, {
    alignSelf: "center",
});
