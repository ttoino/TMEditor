import React, { useState } from "react";
import { styled } from "@common/theme";
import Card from "@common/components/Card";
import { UIComponent } from "../../../types/src";
import { UpdateFn } from "@app/hooks/useLocalState";
import ComponentForm from "./forms/ComponentForm";
import {
    MdCode,
    MdCodeOff,
    MdDeleteOutline,
    MdExpandLess,
    MdExpandMore,
} from "react-icons/md";
import Button from "./Button";
import ComponentIcon from "./ComponentIcon";
import capitalize from "@app/util/capitalize";
import useResizeAnimation from "@app/hooks/useResizeAnimation";

type Props = {
    component: UIComponent;
    update: UpdateFn<UIComponent>;
    remove: () => unknown;
};

const Component = ({ component, update, remove }: Props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    useResizeAnimation(ref, false);

    // @ts-ignore
    const [displayForm, setDisplayForm] = useState(component._open ?? false);
    const [displayJson, setDisplayJson] = useState(false);

    // @ts-ignore
    delete component._open;

    return (
        <Card ref={ref}>
            <StyledHeader>
                <ComponentIcon component={component} />

                <StyledHeading>
                    {capitalize(component.type)}

                    {component.title && ` – ${component.title}`}
                </StyledHeading>

                <Button icon onClick={() => setDisplayForm(!displayForm)}>
                    {displayForm ? <MdExpandLess /> : <MdExpandMore />}
                </Button>
                <Button icon onClick={() => setDisplayJson(!displayJson)}>
                    {displayJson ? <MdCodeOff /> : <MdCode />}
                </Button>
                <Button icon onClick={() => remove()}>
                    <MdDeleteOutline />
                </Button>
            </StyledHeader>

            {displayForm && (
                <StyledForm>
                    <ComponentForm component={component} update={update} />
                </StyledForm>
            )}

            {displayJson && (
                <StyledPre>{JSON.stringify(component, null, 2)}</StyledPre>
            )}
        </Card>
    );
};
export default Component;

const StyledForm = styled("div", {
    display: "flex",
    gap: "$1",
    marginTop: "$2",
    alignItems: "stretch",
    justifyContent: "center",
    flexDirection: "column",
});

const StyledPre = styled("pre", {
    margin: "0",
    marginTop: "$2",
    padding: "$1",
    backgroundColor: "$neutral50",
    borderRadius: "$card",
});

const StyledHeader = styled("header", {
    display: "flex",
    flexDirection: "row",
    gap: "0.5em",
    justifyContent: "right",
    alignItems: "center",
});

const StyledHeading = styled("h2", {
    fontSize: "$big",
    marginRight: "auto",
    marginBlock: "0",
    fontWeight: "500",
});
