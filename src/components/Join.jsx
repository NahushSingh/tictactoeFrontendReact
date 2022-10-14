import React, { useState } from "react";

export default function Join(props) {
    const [detail, setDetail] = useState(() => ({
        user: "",
        room: ""
    }))

    function handleOnChange(e) {
        setDetail(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        props.socketio.emit("player_detail", detail)
    }

    return (
        <div className="join">
            <form className="join_form">
                <legend>Tic Tac Toe</legend>
                <input
                    type="text"
                    placeholder="Room"
                    name="room"
                    id="room"
                    value={detail.room}
                    onChange={handleOnChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    name="user"
                    id="user"
                    value={detail.username}
                    onChange={handleOnChange}
                    required
                />
                <button onClick={handleSubmit}>Join</button>
            </form>
        </div>
    )
}