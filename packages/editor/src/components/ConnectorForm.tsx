import React, {useState} from "react";

import { styled } from "@common/theme";
import Card from "@common/components/Card";

const ConnectorForm = () => {
    const [id, setId] = useState('');
    const [type, setType] = useState('');

    const changeId = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setId(event.target.value);
    }

    const changeType = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setType(event.target.value);
    }

    const componentFields = () => {
        switch (type) {
            case 'sql':
                return (<>
                    Config
                    <label>Database: 
                        <input type="text" name="database"/>
                    </label>
                    <label>Host: 
                        <input type="text" name="host"/>
                    </label>
                    <label>Port: 
                        <input type="numer" name="port"/>
                    </label>
                    <label>Dialect: 
                        <select name="dialect">
                            <option value="sqlite">SQLite</option>
                            <option value="mysql">MySQL</option>
                            <option value="mariadb">MariaDB</option>
                            <option value="postgres">PostgreSQL</option>
                            <option value="mssql">Microsoft SQL Server</option>
                        </select>
                    </label>
                    
                    <label>Storage: 
                        <input type="text" name="storage"/>
                    </label>
                    Authentication
                    <label>Username: 
                        <input type="text" name="user"/>
                    </label>
                    
                    <label>Password: 
                        <input type="password" name="pass"/>
                    </label>
                    <label>Structure, por adicionar</label>

                    <label>Timestamp: 
                        <input type="text" name="timestamp"/>
                    </label>
                    </>);

            case 'firebase':
                return (<>
                    Config?
                    Authentication
                    <label>Email: 
                        <input type="email" name="email"/>
                    </label>
                    <label>Password: 
                        <input type="password" name="pass"/>
                    </label>
                    <label>Timestamp: 
                        <input type="text" name="timestamp"/>
                    </label>
                    <label>Structure, por adicionar</label>

                    <label>Filters, por adicionar</label>

                    </>);

            case 'fhir':
                return (<>
                    <label>Subtype: 
                        <select name="subtype">
                            <option value="hapi">HAPI</option>
                        </select>
                    </label>
                    Config
                    <label>URL: 
                        <input type="url" name="url"/>
                    </label>
                    <label>Authentication, userpass ou bearer, por adicionar</label>
                    <label>Filters, por adicionar</label>
                    </>);

            default:
                return null;
        }
    }

    return(
        <Card>
            <StyledHeading>New Connector</StyledHeading>

            
            <ComponentForm>
                <label>ID: 
                    <input type="text" placeholder="database_id" value={id} onChange={changeId}/>
                </label>

                <label>Type: 
                    <select name="type" value={type} onChange={changeType}>
                        <option value="" selected disabled>Select type</option>
                        <option value="sql">SQL</option>
                        <option value="firebase">Firebase</option>
                        <option value="fhir">Fhir</option>
                    </select>
                </label>

                {type && componentFields()}

                Users
                <label>Table: 
                    <input type="text" name="table"/>
                </label>
                <label>ID Field: 
                    <input type="text" name="idField"/>
                </label>
                <label>Label Field: 
                    <input type="text" name="labelField"/>
                </label>
                <label>Fields, por adicionar</label>
                
                <label>Filters, por adicionar</label>

                <label>Include, por adicionar</label>

                <ComponentFormButtons>
                    <button type="submit">Save</button>
                </ComponentFormButtons>
            </ComponentForm>
        </Card>
    )
}

export default ConnectorForm;

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
