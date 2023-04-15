import React, { useState } from "react";
import { styled } from "@common/theme";
import Card from "@common/components/Card";
import StyledButton from "./StyledButton";

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
    const [pagination, setPagination] = useState('');
    const [exportFlag, setExport] = useState(false);
    const [search, setSearch] = useState(false);
    const [sort, setSort] = useState(false);
    const [precision, setPrecision] = useState('');
    const [text, setText] = useState('');
    

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

    const changePagination = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination(event.target.value);
    }

    const changeExport = () => {
        setExport(!exportFlag);
    }

    const changeSearch = () => {
        setSearch(!search);
    }

    const changeSort = () => {
        setSort(!sort);
    }

    const changePrecision = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPrecision(event.target.value);
    }

    const changeText = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setText(event.target.value);
    }
    

    const componentFields = () => {
        switch (type) {
            case 'chart':
                return (<>
                    <div>
                        <label htmlFor="spec">Spec:</label>
                        <input type="text" placeholder="Spec" id="spec"/>
                    </div>
                    
                </>);

            case 'table':
                return (<>
                    <div>
                        <label htmlFor="pagination">Pagination:</label>
                        <input type="number" placeholder="Pagination" id="pagination" value={pagination} onChange={changePagination}/>
                    </div>
                    
                    <div>
                        <label htmlFor="warnings">Warnings:</label>
                        <input type="text" placeholder="Warnings" id="warnings" required/>
                    </div>
                    
                    <CheckBoxes>
                        <div>
                            <input type="checkbox" id="export" checked={exportFlag} onChange={changeExport}/>
                            <label htmlFor="export"> Export </label>
                        </div>
                        <div>
                            <input type="checkbox" id="search" checked={search} onChange={changeSearch}/>
                            <label htmlFor="search"> Search </label>
                        </div>
                        <div>
                            <input type="checkbox" id="sort" checked={sort} onChange={changeSort}/>
                            <label htmlFor="sort"> Sort </label>
                        </div>
                    </CheckBoxes>
                </>);

            case 'value':
                return (<>
                    <div>
                        <label htmlFor="precision">Precision:</label>
                        <input type="number" placeholder="Precision" id="precision" value={precision} onChange={changePrecision}/>
                    </div>
                    
                    <div>
                        <label htmlFor="warnings">Warnings:</label>
                        <input type="text" placeholder="Warnings" id="warnings"/>
                    </div>
                </>);

            case 'summary':
                return (<>
                    <div>
                        <label htmlFor="precision">Precision:</label>
                        <input type="number" placeholder="Precision" id="precision" value={precision} onChange={changePrecision}/>
                    </div>
                </>);

            case 'columns':
                return (<>
                    <div>
                        <label htmlFor="components">Components:</label> 
                        <input type="text" placeholder="Components" id="components"/>
                    </div>
                </>);

            case 'info':
                return (<>
                    <div>
                        <label htmlFor="text">Text:</label> 
                        <input type="text" placeholder="Text" id="text" value={text} onChange={changeText}/>
                    </div>
                </>);

            case 'tabs':
                return (<> 
                <div>
                    <label htmlFor="panels">Panels:</label>
                    <input type="text" placeholder="Panels" id="panels"/>
                </div>
                </>);

            default:
                return null;
        }
      }


    return(
        <Card>
            <StyledHeading>New Component</StyledHeading>
            <ActionButtons>
                <StyledButton text={"Edit"} onClick={changeFormVisibility}/>
                <StyledButton text={"Delete"} onClick={() => deleteComponent(index)}/>
            </ActionButtons>

            {displayForm && (
            <ComponentForm>
                <div>
                    <label htmlFor="title"> Component title: </label>
                    <input type="text" placeholder="Component Title" id="title" value={title} onChange={changeTitle}/>
                </div>
                
                <div>
                    <label htmlFor="type"> Component type: </label>
                    <select name="type" value={type} onChange={changeType} id="type">
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
                </div>

                {type && componentFields()}

                <ActionButtons>
                    <StyledButton text={"Save"} onClick={editComponent}/>
                    <StyledButton text={"Cancel"} onClick={changeFormVisibility}/>
                </ActionButtons>
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

const ComponentForm = styled('form', {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1em',
    marginTop: '2.5em',

    "& > div": {
        display: "flex",
        alignItems: "center",

        "& > label": {
            flexShrink: '0',
            marginRight: "0.6em",
        },

        "& > input, & > select": {
            padding: "0.3em 0.5em",
            color: "$neutral20",
            fontSize: "1em",
            borderRadius: "0.3em",
            border:"1px solid $neutral50",
            backgroundColor:  "$primaryTintHover",
            outline: "none",
            flexGrow: '1',
            width: '100%',
        },
    }
})

const ActionButtons= styled('div', {
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.5em',
    justifyContent: "right",
})

const CheckBoxes = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    columnGap: '4em',
    justifyContent: "left",
})