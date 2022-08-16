import { useParams } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage } from "../hooks";
import { boardInfo } from "../types";
import {  DisplayTile } from "../components";
import style from "./GameHistoryDetails.module.css";

export default function GameHistoryDetails() {
  const { boardId } = useParams();
  const [idCheck, setIdCheck] = useState(boardId?.split(":")[1]);
  const [boards] = useLocalStorage<Record<string, boardInfo>>(`boards`, {});

  const boardIdentifier = boardId?.split(":")[1]
  
  const { size, date, winner, moves} = boards[`board-${boardIdentifier}`]

  const tempSize = size || 15

  function tileColor(index: number){
    const tileIndex = moves.indexOf(index)
    if (moves.includes(index) && tileIndex % 2 == 1) return 'White'
    else return 'Black' 
  }

  return (
    <div className={style.container}>
      <div className={style.turn}>{`Winner: ${winner}`}</div>
      <div className={style.board}>
        <div
          className={style.seats}
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {[...Array(tempSize  * tempSize)].map((key, index) => (
            <DisplayTile
              key={`seat-${index}`}
              id={index}
              isSelected={moves.includes(index)}
              player={tileColor(index)}
              text={moves.indexOf(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
