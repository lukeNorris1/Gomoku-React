import { useState, useContext, useReducer } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import style from "./Game.module.css";
import { PLAYER_TURN } from "../constants";
import { BoardContext } from "../context";
import { Button, Tile } from "../components";

export default function Game() {
  console.log("load game");

  const { board } = useContext(BoardContext);
  const [player, setPlayer] = useState("Black");
  const [gameEnd, setGameEnd] = useState(false)

  const navigate = useNavigate();

  console.log(board?.boardSize);

  //if (!board?.boardSize) return <Navigate to="/" replace />;
  const tempBoardSize = 15

  const togglePlayer = () => {
    player === "Black" ? setPlayer("White") : setPlayer("Black");
  };

  function gameFinishCheck(){
    !gameEnd ? navigate("/") :navigate("/GameHistory")

  }

  return (
    <div className={style.container}>
      <div className={style.turn}>{`Current Player: ${player}`}</div>
      <div className={style.board}>
        <div
          className={style.seats}
          style={{ gridTemplateColumns: `repeat(${tempBoardSize}, 1fr)` }}
        >
          {/* {[...Array(board?.boardSize * board?.boardSize)].map((_, index) => (
            <Tile key={`seat-${index}`} id={index} isSelected={false} />
          ))} */}
          {[...Array(tempBoardSize * tempBoardSize)].map((_, index) => (
            <Tile key={`seat-${index}`} id={index} isSelected={false} />
          ))}
        </div>
      </div>
        <div className={style.navigation}>
          <button className={style.navText}>Restart</button>
          <button className={style.navText} onClick={gameFinishCheck}>Leave</button>
        </div>
      <Button onClick={togglePlayer}>Toggle</Button>
    </div>
  );
}
