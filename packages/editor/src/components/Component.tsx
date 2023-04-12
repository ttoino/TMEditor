import React, { useState } from "react";
import { styled } from "@common/theme";
import Card from "@common/components/Card";

type Props = {
    children: String,
    component: any,
    index: number,
}

const Component = ({component, index}: Props) => {
    const [displayForm, setDisplayForm] = useState(false);

    const changeFormVisibility = () => {
        setDisplayForm(!displayForm);
    }

    const editComponent = () => {
        //TODO
    }

    const deleteComponent = (index: number) => {
        //TODO
    }

    return(
        <Card>
            <StyledHeading>{component.title} {index}</StyledHeading>
            <EditComponentButton onClick={changeFormVisibility}>Edit</EditComponentButton>
            <DeleteComponentButton onClick={() => deleteComponent(index)}>Delete</DeleteComponentButton>

            {displayForm && (
                <ComponentForm onSubmit={editComponent}>
                    <input type="text" placeholder="Component Title"/>

                    <select name="type">
                        <option value="" selected disabled>Select type</option>
                        <option value="chart">Chart</option>
                        <option value="table">Table</option>
                        <option value="value">Value</option>
                        <option value="summary">Summary</option>
                        <option value="columns">Columns</option>
                        <option value="heading">Heading</option>
                        <option value="Info">Info</option>
                        <option value="Tabs">Tabs</option>
                    </select>

                    <ComponentFormButtons>
                        <button type="submit">Sync</button>
                        <button onClick={changeFormVisibility}> Cancel </button>
                    </ComponentFormButtons>
                </ComponentForm>)
            }
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

const ComponentForm = styled('form', {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1em',
    marginTop: '1em'
})

const ComponentFormButtons = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.5em',
    
})