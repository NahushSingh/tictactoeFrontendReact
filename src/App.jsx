import React, { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
import Board from './components/Board';
import Join from './components/Join';
import Portal from './components/Portal';
import PortalReactDOM from 'react-dom';

function App(props) {

  const board = useRef({})

  const [alloted, setAlloted] = useState(() => (
    JSON.parse(sessionStorage.getItem("tttUserDetail")) ||
    { username: "", symbol: "", token: "", score: 0, room: "" }
  ))
  const cur_p = useRef()
  cur_p.current = alloted

  const [opponent, setOpponent] = useState(() => ({
    username: "", score: 0
  }))

  const op_p = useRef()
  op_p.current = opponent

  const [modal, setModal] = useState(() => ({
    type: "empty",
    message: "",
    button_text: ""
  }))

  function reset() {
    cur_p.current = { username: "", symbol: "", token: "", score: 0, room: "" }
    op_p.current = { username: "", score: 0 }
    setAlloted(cur_p.current)
    setOpponent(op_p.current)
    setModal({
      type: "empty",
      message: "",
      button_text: ""
    })
    sessionStorage.removeItem("tttUserDetail")
  }

  function game_over(data) {
    let winner = data["winner"]["token"] === cur_p.current.token
    if (data["draw"] === false) {
      if (winner) {
        setAlloted(prev => {
          cur_p.current = {
            ...prev,
            score: data["winner"]["score"]
          }
          return cur_p.current
        })
      } else {
        setOpponent(prev => {
          op_p.current = {
            ...prev,
            score: data["winner"]["score"]
          }
          return op_p.current
        })
      }
    }
    setModal(() => {
      return {
        type: "game_over",
        win: winner,
        draw: data["draw"],
        message: data["draw"] ? "You were close!!" : winner ? "Clever Haan!!..." : "Better luck next time. Sorry!!!... ",
        player: op_p.current.username,
        playerScore: cur_p.current.score,
        opponentScore: op_p.current.score,
        button_text: "Leave Room",
        playAgain: () => {
          props.socketio.emit("play_again", cur_p.current)
        }
      }
    })
  }


  function handleClick() {
    props.socketio.emit("disconnect_socket", alloted)
    reset();
  }

  function accept_replay(data) {
    setAlloted(prev => {
      cur_p.current = {
        ...prev,
        symbol: data.symbol
      }
      return cur_p.current
    })
    setModal({
      type: "empty",
      message: "",
      button_text: ""
    })
    board.current = {}
  }

  useEffect(() => {
    // const socketio = io("http://127.0.0.1:5000")
    props.socketio.on('connect', () => {
      const oldAlloted = JSON.parse(sessionStorage.getItem("tttUserDetail"))
      if (oldAlloted !== null && oldAlloted.username !== "") {
        props.socketio.emit("continue_old_session", oldAlloted)
      }
    })

    props.socketio.on('expired', () => {
      reset()
    })

    props.socketio.on('player_detail', (data) => {
      setAlloted(prev => {
        sessionStorage.setItem("tttUserDetail", JSON.stringify({ ...prev, ...data }))
        return cur_p.current = { ...prev, ...data }
      })
      setModal({
        type: "waiting",
        message: "Waiting for opponent ...",
        button_text: "Leave Room"
      })
    })

    props.socketio.on('opponent_detail', (player) => {
      board.current = player.board || {}
      op_p.current = player.opponent
      setOpponent(op_p.current)
      setModal(prev => ({ ...prev, type: "empty" }))
    })

    props.socketio.on("player_left", (data) => {
      setModal({
        type: "player_left",
        name: data.opponent.username,
        player: data.opponent.username,
        playerScore: data.player.score,
        opponentScore: data.opponent.score,
        button_text: "Back",
        back: reset
      })
    })

    props.socketio.on("game_over", game_over)

    props.socketio.on("play_req", (data) => {
      setModal({
        type: "play_req",
        player: op_p.current.username,
        button_text: "Leave Room",
        playAgain: () => {
          accept_replay(data)
          props.socketio.emit("accept_replay", cur_p.current)
        },
      })
    })

    props.socketio.on("accepted", accept_replay)

  }, [])


  return (
    <React.Fragment >

      {alloted.room === "" &&
        <Join
          socketio={props.socketio}
        />
      }

      {(opponent.username !== "" && modal.type === "empty") &&
        <Board
          board={board}
          player={alloted}
          socketio={props.socketio}
          opponent={opponent}
          onClick={handleClick}
        />
      }

      {modal.type !== "empty" &&
        PortalReactDOM.createPortal(
          <Portal
            room={alloted.room}
            modal={modal}
            handleClick={handleClick}
          />,
          document.getElementById('portal')
        )
      }

    </React.Fragment>
  )

}

export default App
