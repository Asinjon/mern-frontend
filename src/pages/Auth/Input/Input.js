import React from "react";

const Input = ({type, id, placeholder, name}) => {
    return (
        <input name={name} type={type} id={id} placeholder={placeholder}/>
    )
}

export default Input;