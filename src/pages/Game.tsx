import { useState, useContext, useReducer, useEffect } from "react";
import {Navigate, useNavigate, useLocation } from "react-router-dom";
import { BoardContext, UserContext } from "../context";
import { Button, Tile } from "../components";
import { useLocalStorage } from "../hooks";
import { BoardActionType } from "../constants";
import { boardInfo } from "../types";
import style from "./Game.module.css";

type BoardAction = {
  type: BoardActionType;
  payload: any;
};



function boardReducer(state: boardInfo, action: BoardAction) {
  const { size, date, winner, moves } = state
  const { type, payload } = action;
  switch (type) {
    case BoardActionType.SELECT:
      return {
        size: size, date: date, winner: winner, moves: [...moves, payload]
      }
    case BoardActionType.SIZE:
      return {
        size: payload, date: date, winner: winner, moves: moves
      }
    case BoardActionType.DATE:
      return {
        size: size, date: payload, winner: winner, moves: moves
      }
    case BoardActionType.WINNER:
      return {
        size: size, date: date, winner: payload, moves: moves
      }
    case BoardActionType.DESELECT:
      return {size: size, date: date, winner: payload, moves: moves.filter((seat) => seat !== payload)}
    default:
      return state;
  }
}

const getDate: () => string = () => {
  const currentDate = new Date();
  return `
    ${currentDate.getDate()}/
    ${currentDate.getMonth() + 1}/
    ${currentDate.getFullYear()}`.replace(/\s/g, "");
}

export default function Game() {
  console.log("load game");

  const { board } = useContext(BoardContext);
  const [player, setPlayer] = useState("Black");
  const { user } = useContext(UserContext);
  const [boardAddition, setBoardAddition] = useState(1);
  const [gameEnd, setGameEnd] = useState(false);
  const [playerMessage, setPlayerMessage] = useState(`Current Player: ${player}`)
  const [localBoardSize, setLocalBoardSize] = useState(15);
  const navigate = useNavigate();

  const [boards, saveBoards] = useLocalStorage<Record<string, boardInfo>>(
    `boards`,
    {}
  );
  const {[`board-${boardAddition}`]: selectedTiles = {}, currentBoard = { size: 0, date: "", winner: "", moves: [] }, ...otherBoards } = boards;

  const [state, dispatch] = useReducer(boardReducer, currentBoard);

  useEffect(() => {
    return () => {
      setBoardAddition(Object.keys(boards).length);

      if (board?.boardSize) {
        setLocalBoardSize(board.boardSize);
        dispatch({ type: BoardActionType.SIZE, payload: board.boardSize })
      }
      dispatch({ type: BoardActionType.DATE, payload: getDate() })
    };
  }, []);

  useEffect(() => {
    gameFinishCheck()
  }, [state]);

  //! Currently not working properly
  const restartClick = () => {
    saveBoards(otherBoards);
    dispatch({ type: BoardActionType.EMPTY, payload: '' })
  };

  function leaveButton() {
    if (gameEnd) {
      saveBoards({ ...boards, [`board-${boardAddition}`]: state });
      navigate("/gameHistory");
    }
    else {
      navigate("/");
    }
    
  }

  function indexOfTile(value: number){
    return state.moves.indexOf(value)
  }

  function gameFinishCheck() {
    if (state.moves.length < 9) return
    const base = state.moves[state.moves.length - 1]

    if (checkHorizontal(base) || 
      checkVertical(base) || 
      checkDiagonalTopLeftBottomRight(base) || 
      checkDiagonalBottomLeftTopRight(base)){
        setGameEnd(true)
        setPlayer('')
        togglePlayer()
        if (state.moves.length % 2 == 1){
          dispatch({ type: BoardActionType.WINNER, payload: 'Black' })
        }
        else {
          dispatch({ type: BoardActionType.WINNER, payload: 'White' })
        }
      }
  }

  function checkHorizontal(baseCase: number){
    var counter = 1
    var tileIterator = 1
    for (var i = 1; i < 5; i++){
      if ((indexOfTile(baseCase) % 2 === 1) === (indexOfTile(baseCase - tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase - tileIterator) !== -1 && state.moves.includes(baseCase - tileIterator)){
          counter++
          tileIterator -= 1
        }
      } else break
    }
    tileIterator = 1
    for (var i = 1; i < 5; i++){
      if ((indexOfTile(baseCase) % 2 === 1) === (indexOfTile(baseCase + tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase + tileIterator) !== -1 && state.moves.includes(baseCase + tileIterator)){
          counter++
          tileIterator += 1
        }
      } else break
    }
    return counter >= 5
  }

  function checkVertical(baseCase: number){
    var counter = 1
    var tileIterator = state.size
    for (var i = 1; i < 5; i++){
      if ((indexOfTile(baseCase) % 2 === 1) === (indexOfTile(baseCase - tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase - tileIterator) !== -1 && state.moves.includes(baseCase - tileIterator)){
          counter++
          tileIterator -= state.size
        }
      } else break
    }
    tileIterator = state.size
    for (var i = 1; i < 5; i++){
      if ((indexOfTile(baseCase) % 2 === 1) === (indexOfTile(baseCase + tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase + tileIterator) !== -1 && state.moves.includes(baseCase + tileIterator)){
          counter++
          tileIterator += state.size
        }
      } else break
    }
    return counter >= 5
  }

  function checkDiagonalTopLeftBottomRight(baseCase: number){
    var counter = 1
    var tileIterator = state.size + 1
    for (var i = 1; i < 5; i++){
      if ((indexOfTile(baseCase) % 2 === 1) === (indexOfTile(baseCase - tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase - tileIterator) !== -1 && state.moves.includes(baseCase - tileIterator)){
          counter++
          tileIterator += state.size + 1
        }
      } else break
    }
    tileIterator = state.size + 1
    for (var j = 1; j < 5; j++){
      if ((indexOfTile(baseCase) % 2 == 1) === (indexOfTile(baseCase + tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase + tileIterator) !== -1 && state.moves.includes(baseCase + tileIterator)){
          counter++
          tileIterator += state.size + 1
        }
      } else break
    }
    return counter >= 5
  }

  function checkDiagonalBottomLeftTopRight(baseCase: number){
    var counter = 1
    var tileIterator = state.size - 1
    for (var i = 1; i < 5; i++){
      if ((indexOfTile(baseCase) % 2 === 1) === (indexOfTile(baseCase - tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase - tileIterator) !== -1 && state.moves.includes(baseCase - tileIterator)){
          counter++
          tileIterator += state.size - 1
        }
      } else break
    }
    tileIterator = state.size - 1
    for (var j = 1; j < 5; j++){
      if ((indexOfTile(baseCase) % 2 == 1) === (indexOfTile(baseCase + tileIterator) % 2 === 1)){
        if (indexOfTile(baseCase + tileIterator) !== -1 && state.moves.includes(baseCase + tileIterator)){
          counter++
          tileIterator += state.size - 1
        }
      } else break
    }
    return counter >= 5
  }

  const togglePlayer = () => {
    if (!gameEnd) {
      player === "Black" ? setPlayer("White") : setPlayer("Black");
      setPlayerMessage(`Current Player: ${player}`)
    } else if (state.moves.length == (state.size * state.size)){
      setPlayerMessage('Draw')
    } else setPlayerMessage(`Winner: ${state.winner}`)
  };


  if (!user) return <Navigate to="/" replace />;

  return (
    <div className={style.container}>
      <div className={style.turn}>{playerMessage}</div>
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
              isSelected={currentBoard.moves.includes(index)}
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
        <button className={style.navText} onClick={leaveButton}>
          Leave
        </button>
      </div>
    </div>
  );
}
