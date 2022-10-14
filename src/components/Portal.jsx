import React from "react";

export default function Portal(props) {
    return (
        <div className="overlay">
            <div className="modal">
                <h3 style={{ marginRight: "auto" }}>Room: {props.room}</h3>
                <h1 className="modal_text">
                    {props.modal.type === "waiting" && props.modal.message}
                    {props.modal.type === "player_left" && `${props.modal.name} left!!`}
                    {props.modal.type === "game_over" && `${props.modal.message}`}
                    {props.modal.type === "play_req" && `${props.modal.player} wants to play again!!`}
                </h1>
                {(props.modal.type !== "waiting" && props.modal.type !== "play_req") &&
                    <p className="final_score">
                        Your Score: {props.modal.playerScore}
                        <span className="span_space">{props.modal.player}'s Score: {props.modal.opponentScore}</span> <br /><br />
                        {
                            props.modal.draw ?
                                <span>Draw!! 🤞</span> :
                                props.modal.win ?
                                    <span className="blue">You Won!! 👍</span> :
                                    <span className="red">You lost!! 👎</span>
                        }
                    </p>
                }
                <div className="btn_container">
                    {
                        (props.modal.type === "game_over" || props.modal.type === "play_req") &&
                        <button className="play_button" onClick={props.modal.playAgain}>Play Again!!</button>
                    }
                    <button className="modal_button" onClick={props.modal.back || props.handleClick}>{props.modal.button_text}</button>
                </div>
            </div>
        </div>
    )
}