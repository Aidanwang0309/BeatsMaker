import React from 'react'


export const Button = ({ className, label, icon }) => {


    return (
        <button>
            <img src={icon}></img>
            {label}
        </button>
    )
}
