import { useState, useContext, useReducer, useEffect } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import style from "./Game.module.css";
import { BoardContext, UserContext } from "../context";
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

  const { board } = useContext(BoardContext);
  const [player, setPlayer] = useState("Black");
  const { user } = useContext(UserContext);
  const [boardAddition, setBoardAddition] = useState(1);
  const [gameEnd, setGameEnd] = useState(false);
  const [winnerBoard, setWinnerBoard] = useState<any[]>([]);
  const [localBoardSize, setLocalBoardSize] = useState(15);
  const navigate = useNavigate();

  const [boards, saveBoards] = useLocalStorage<Record<string, number[]>>(
    `boards`,
    {}
  );

  //ToDo CANT GET WINNERS LIST AND BOARD LIST TO BE ADDED AT THE SAME TIME - TRY USEFFECT HOOK????

  const { [`board-${boardAddition}`]: selectedTiles = [], ...otherBoards } =
    boards;
    
  const [state, dispatch] = useReducer(boardReducer, selectedTiles);
  
  useEffect(() => {
    return () => {
      setBoardAddition(Object.keys(boards).length);

      if (board?.boardSize) setLocalBoardSize(board.boardSize);
    };
  }, []);

  const restartClick = () => {
    saveBoards(otherBoards);
    // navigate(`/GameHistory/${localBoardSize}`);
  };

  function goNext() {
    setWinnerBoard((winnerBoard) => [...winnerBoard, [1]]);
    console.log(`Winner: ${winnerBoard}`);
    saveBoards({ ...boards, [`winners`]: winnerBoard });
    //saveBoards({...boards,[`board-${boardAddition}`]: state});
    navigate("/gameHistory");
  }

  const togglePlayer = () => {
    player === "Black" ? setPlayer("White") : setPlayer("Black");
    saveBoards({
      ...boards,
      [`board-${boardAddition}`]: state,
    });
  };

  function gameFinishCheck() {
    //After win condition is met change //boardWinner('Black')
    !gameEnd ? navigate("/") : navigate("/GameHistory");
  }

  if (!user) return <Navigate to="/" replace />;

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
              isSelected={selectedTiles.includes(index)}
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
      <Button onClick={goNext}>GoTO</Button>
    </div>
  );
}
