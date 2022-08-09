import { useState, useContext, useReducer } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import style from "./Game.module.css";
import { PLAYER_TURN } from "../constants";
import { BoardContext } from "../context";
import { Button, Tile } from "../components";
import { useLocalStorage } from "../hooks";
import { BoardActionType } from "../constants";

type BoardAction = {
  type: BoardActionType;
  payload: number;
};

function boardReducer(state: number[], action: BoardAction) {
  const { type, payload } = action;
  switch (type) {
    case BoardActionType.SELECT:
      return [...state, payload];
    default:
      return state;
  }
}

export default function Game() {
  console.log("load game");

  const { boardId } = useParams();
  const { board } = useContext(BoardContext);
  const [player, setPlayer] = useState("Black");
  const [gameEnd, setGameEnd] = useState(false);
  const navigate = useNavigate();

  const [boards, saveBoards] = useLocalStorage<Record<string, number[]>>(
    `boards`,
    {}
  );
  const { [`board-${boardId}`]: selectedBoard = [], ...otherBoards } = boards;

  console.log(selectedBoard);

  const [state, dispatch] = useReducer(boardReducer, selectedBoard);

  //if (!board?.boardSize) return <Navigate to="/" replace />;
  const tempBoardSize = 15;

  const clickTest = () => {
    saveBoards({ ...boards, [`board-1`]: state });
    navigate("/GameHistory");
  };

  const togglePlayer = () => {
    player === "Black" ? setPlayer("White") : setPlayer("Black");
  };

  function gameFinishCheck() {
    !gameEnd ? navigate("/") : navigate("/GameHistory");
  }

  return (
    <div className={style.container}>
      <div className={style.turn}>{`Current Player: ${player}`}</div>
      <div className={style.board}>
        <div
          className={style.seats}
          onClick={togglePlayer}
          style={{ gridTemplateColumns: `repeat(${tempBoardSize}, 1fr)` }}
        >
          {/* {[...Array(board?.boardSize * board?.boardSize)].map((_, index) => (
            <Tile key={`seat-${index}`} id={index} isSelected={false} />
          ))} */}
          {[...Array(tempBoardSize * tempBoardSize)].map((_, index) => (
            <Tile
              key={`seat-${index}`}
              id={index}
              isSelected={selectedBoard.includes(index)}
              dispatch={dispatch}
              player={player}
            />
          ))}
        </div>
      </div>
      <div className={style.navigation}>
        <button className={style.navText} onClick={clickTest}>
          Restart
        </button>
        <button className={style.navText} onClick={gameFinishCheck}>
          Leave
        </button>
      </div>
    </div>
  );
}
