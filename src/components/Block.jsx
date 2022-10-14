import React from "react"

export default function Block(props) {
    function clickHandler(){
        if(props.symbol === "-")
            props.move(props.id)
    }
    return (
        <div className="block" onClick={clickHandler}>
            <p className={props.symbol === "X" ? "red" : "blue"}>
                {props.symbol}
            </p>
        </div>
    )
}