import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, BoardContext } from "../context";
import { Button, DisplayTile } from "../components";
import { useLocalStorage } from "../hooks";
import { boardInfo } from "../types";
import style from "./Home.module.css";

export default function Home() {
  const { user } = useContext(UserContext);
  const { changeBoard } = useContext(BoardContext);
  const [boardSize, setBoardSize] = useState(5);
  const navigate = useNavigate();
  
  const [boards] = useLocalStorage<Record<string, boardInfo>>(`boards`, {});

  
  const randomBoard = Object.keys(boards).at(getRandomArbitrary(1,Object.keys(boards).length))
  const { size, moves} = boards[`${randomBoard}`]
  const tempSize = size || 12

  function startPress() {
    if (!user) navigate("/login");
    else {
      changeBoard(boardSize);
      navigate(`/game`);
    }
  }

  function getRandomArbitrary(min:number, max:number) {
    return Math.random() * (max - min) + min;
}

function tileColor(index: number){
  const tileIndex = moves.indexOf(index)
  if (moves.includes(index) && tileIndex % 2 === 1) return 'White'
  else return 'Black' 
}

const boardDiv = 
<>
  <div className={style.boardTitle}>{`Board: ${randomBoard}`}</div>
  <div className={style.board}>
    <div
      className={style.tiles}
      style={{ gridTemplateColumns: `repeat(${tempSize}, 1fr)` }}
    >
      {[...Array(tempSize  * tempSize)].map((key, index) => (
        <DisplayTile
          key={`tile-${index}`}
          id={index}
          isSelected={moves.includes(index)}
          player={tileColor(index)}
          text={moves.indexOf(index)}
        />
      ))}
    </div>
  </div>
</>

  return (
    <div className={style.container}>
      <select
        className={style.dropdown}
        onChange={(e) => {
          setBoardSize(parseInt(e.currentTarget.value, 10))}
        }
      >
        {[...Array(15)].map((_, index) => (
          <option key={index + 5} value={index + 5}>{` ${index + 5} x ${
            index + 5
          }`}</option>
        ))}
      </select>
      <Button key={1} onClick={startPress}>
        Start
      </Button>

        {boardDiv}


    </div>
  );
}
