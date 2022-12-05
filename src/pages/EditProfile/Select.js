import React from "react";

const Select = ({name, id, options, size, reference, onChange}) => {
    return (
        <select onChange={onChange} size={size} ref={reference} name={name} id={id}>
            {
                options
            }
        </select>
    )
}

export default Select;