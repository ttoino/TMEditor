import React from "react";
import { styled } from "@common/theme";
import Card from "@common/components/Card";

type Props = {
    children: String,
    component: any,
    index: number,
}

const Component = ({component, index}: Props) => {

    const editComponent = () => {
        //TODO
    }

    const deleteComponent = (index: number) => {
        //TODO
    }

    return(
        <Card>
            <StyledHeading>{component.title} {index}</StyledHeading>
            <EditComponentButton onClick={editComponent }>Edit</EditComponentButton>
            <DeleteComponentButton onClick={() => deleteComponent(index)}>Delete</DeleteComponentButton>
        </Card>

    )
}

export default Component;


const StyledHeading = styled('h3', {
    display: 'flex',
    margin: 0,
    marginBottom: '$2',
    color: '$neutral20',
    fontWeight: 400
})

const EditComponentButton = styled("button", {
    padding: "0.5em 1em",
    fontSize: "1em",
    border: "none",
    borderRadius: "0.3em",
    backgroundColor:  "#007eb2",
    color: "white",
    cursor: "pointer",
}); 

const DeleteComponentButton = styled("button", {
    padding: "0.5em 1em",
    fontSize: "1em",
    border: "none",
    borderRadius: "0.3em",
    backgroundColor:  "#007eb2",
    color: "white",
    cursor: "pointer",
});