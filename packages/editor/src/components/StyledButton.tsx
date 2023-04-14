import React from "react";

type Props = {
    text: String,
    onClick: () => void
}


const StyledButton = ({text, onClick}: Props) => {

    const buttonStyle = {
        padding: "0.3em 0.8em",
        fontSize: "1em",
        border: "none",
        borderRadius: "0.3em",
        backgroundColor:  "#007eb2",
        color: "white",
        cursor: "pointer",
    };


    return (
        <button style={buttonStyle} onClick={onClick}> {text} </button>
    );
}
export default StyledButton;