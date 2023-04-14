import React, { useState } from "react";
import { styled } from "@common/theme";
import Card from "@common/components/Card";

type Props = {
    children: String,
    component: any,
    components: any[],
    setComponents: (newComponents: any[]) => void,
    index: number
}

const Component = ({component, components, setComponents, index}: Props) => {
    const [displayForm, setDisplayForm] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');

    const editComponent = () => {
        //TODO
    }

    const deleteComponent = (index: number) => {
        setComponents(components.filter((_: any, i: number) => i !== index))
    }

    const changeFormVisibility = () => {
        setDisplayForm(!displayForm);
    }

    const changeTitle = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value);
    }

    const changeType = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setType(event.target.value);
    }

    const componentFields = () => {
        switch (type) {
            case 'chart':
                return <input type="text" placeholder="Spec"  />;

            case 'table':
                return (<>
                    <input type="number" placeholder="Pagination" />
                    <input type="text" placeholder="Warnings" required/>
                    <CheckBoxes>
                        <div>
                            <input type="checkbox" id="export" />
                            <label htmlFor="export"> Export </label>
                        </div>
                        <div>
                            <input type="checkbox" id="search" required/>
                            <label htmlFor="search"> Search </label>
                        </div>
                        <div>
                            <input type="checkbox" id="sort" required/>
                            <label htmlFor="sort"> Sort </label>
                        </div>
                    </CheckBoxes>
                    </>);

            case 'value':
                return (<>
                    <input type="number" placeholder="Precision" />
                    <input type="text" placeholder="Warnings" />
                    </>);

            case 'summary':
                return <input type="number" placeholder="Precision" />;

            case 'columns':
                return <input type="text" placeholder="Components" />

            case 'info':
                return <input type="text" placeholder="Text" />;

            case 'tabs':
                return <input type="text" placeholder="Panels" />;

            default:
                return null;
        }
      }


    return(
        <Card>
            <StyledHeading>New Component</StyledHeading>
            <EditComponentButton onClick={changeFormVisibility}>Edit</EditComponentButton>
            <DeleteComponentButton onClick={() => deleteComponent(index)}>Delete</DeleteComponentButton>

            {displayForm && (
                <ComponentForm onSubmit={editComponent}>
                    <input type="text" placeholder="Component Title" value={title} onChange={changeTitle}/>

                    <select name="type" value={type} onChange={changeType}>
                        <option value="" selected disabled>Select type</option>
                        <option value="chart">Chart</option>
                        <option value="table">Table</option>
                        <option value="value">Value</option>
                        <option value="summary">Summary</option>
                        <option value="columns">Columns</option>
                        <option value="heading">Heading</option>
                        <option value="info">Info</option>
                        <option value="tabs">Tabs</option>
                    </select>

                    {type && componentFields()}

                    <ComponentFormButtons>
                        <button type="submit">Save</button>
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
    marginTop: '2.5em',

    "& input": {
        padding: "0.3em 0.5em",
        fontSize: "1em",
        borderRadius: "0.3em",
        border:"1px solid $neutral50",
        backgroundColor:  "$primaryTintHover",
        outline: "none"
    },

    "& select": {
        padding: "0.3em 0.5em",
        fontSize: "1em",
        borderRadius: "0.3em",
        borderColor:"$neutral50",
        backgroundColor: "$primaryTintHover",
        color: "$neutral20",
    },
})

const ComponentFormButtons = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.5em',
    justifyContent: "right",

    "& button": {
        padding: "0.3em 0.8em",
        fontSize: "1em",
        border: "none",
        borderRadius: "0.3em",
        backgroundColor:  "#007eb2",
        color: "white",
        cursor: "pointer",
    },
})

const CheckBoxes = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    columnGap: '4em',
    justifyContent: "left",
})