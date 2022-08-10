import { useState, useContext, useReducer, useEffect } from "react";
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
    case BoardActionType.DESELECT:
      return state.filter((seat) => seat !== payload);
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
  const [localBoardSize, setLocalBoardSize] = useState(15);
  const navigate = useNavigate();

  const [boards, saveBoards] = useLocalStorage<Record<string, number[]>>(
    `boards`,
    {}
  );

  //USE REDUCER HOOK
  const { [`board-${boardId}`]: selectedBoard = [], ...otherBoards } = boards;
  const [state, dispatch] = useReducer(boardReducer, selectedBoard);

  useEffect(() => {
    return () => {
      if (board?.boardSize) setLocalBoardSize(board.boardSize);
    };
  }, []);

  const restartClick = () => {
    console.log(state);
    // saveBoards({ ...boards, [`board-1`]: state });
    // navigate("/GameHistory");
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
          style={{ gridTemplateColumns: `repeat(${localBoardSize}, 1fr)` }}
        >
          {[...Array(localBoardSize * localBoardSize)].map((_, index) => (
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
        <button className={style.navText} onClick={restartClick}>
          Restart
        </button>
        <button className={style.navText} onClick={gameFinishCheck}>
          Leave
        </button>
      </div>
      <Button onClick={togglePlayer}>Toggle</Button>
    </div>
  );
}
