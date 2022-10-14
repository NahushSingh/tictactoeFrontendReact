import React, { useEffect, useState } from "react";
import Block from './Block'
import defaultBoard from '../board';
import { useRef } from "react";

export default function Board(props) {

  const [board, setData] = useState(() => ({
    playerTurn: props.board.current.turn ? props.board.current.turn === props.player.symbol : props.player.symbol === "O",
    data: props.board.current.data ? props.board.current.data : defaultBoard.data
  }))

  useEffect(() => {
    const update = (newData) => {
      setData((prev) => {
        props.board.current = {
          playerTurn: newData.turn === props.player.symbol ? true : false,
          data: prev.data.map((block) => (block.pos === newData.pos ? { ...block, symbol: newData.symbol } : block))
        }
        return props.board.current
      })
    }

    props.socketio.on("move_update", update)
  }, [])

  function move(id) {
    if (board.playerTurn) {
      props.socketio.emit('move', { "room": props.player.room, "pos": id, "symbol": props.player.symbol })
      setData(prev => ({
        ...prev,
        playerTurn: false
      }))
    }
  }

  let blocks = []
  for (let i = 0; i < 3; i++) {
    let row = []
    for (let j = i * 3; j < (i + 1) * 3; j++) {
      row.push(board.data[j]);
    }
    blocks.push(row)
  }

  return (
    <React.Fragment>
      <button className="exit" onClick={props.onClick}>←</button>
      <div className='tictactoe'>
        <p className="player">
          <span className={`you ${props.player.symbol === "X" ? "red" : "blue"}`}>
            {props.player.username}:{props.player.score}
          </span>
          <span className={`opponent ${props.player.symbol === "O" ? "red" : "blue"}`}>
            {props.opponent.username}:{props.opponent.score}
          </span>
        </p>
        {blocks.map((row, id) => {
          return (
            <div className='row' key={id}>
              {row.map((block) => <Block key={block.pos} id={block.pos} move={move} symbol={block.symbol} />)}
            </div>
          )
        })}
      </div>
    </React.Fragment>
  )
}