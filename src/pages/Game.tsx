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
      setBoardAddition(Object.keys(boards).length);
      if (board?.boardSize) {
        setLocalBoardSize(board.boardSize);
        dispatch({ type: BoardActionType.SIZE, payload: board.boardSize })
      }
      dispatch({ type: BoardActionType.DATE, payload: getDate() })

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
    //if (state.moves.length < 9) return
    const base = state.moves[state.moves.length - 1]

    // if (checkHorizontal(base) || 
    //   checkVertical(base) || 
    //   checkDiagonalTopLeftBottomRight(base) || 
    //   checkDiagonalBottomLeftTopRight(base)){
    //     setGameEnd(true)
    //     setPlayer('')
    //     togglePlayer()
    //     if (state.moves.length % 2 == 1){
    //       dispatch({ type: BoardActionType.WINNER, payload: 'Black' })
    //     }
    //     else {
    //       dispatch({ type: BoardActionType.WINNER, payload: 'White' })
    //     }
    //   }

    //checkHorizontal(base)
    //checkVertical(base)
    if (checkDiagonalTopLeftBottomRight(base) || checkDiagonalBottomLeftTopRight(base)) console.log('Winner')
  }

  function checkHorizontal(baseCase: number){
    if (!baseCase) return
    var counter = 1
    var iterator = 1
    for (var i:number = 1; i < 5; i++){
      if (state.moves.includes(baseCase - iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase - iterator) % 2 === 0)){
          counter += 1
          iterator += 1
        }
      } else break
    }
    iterator = 1
    for (var i:number = 1; i < 5; i++){
      if (state.moves.includes(baseCase + iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase + iterator) % 2 === 0)){
          counter += 1
          iterator += 1
        }
      } else break
    }
    console.log(`Counter: ${counter}`)
  }

  function checkVertical(baseCase: number){
    if (!baseCase) return
    const tileDifference = state.size
    var counter = 1
    var iterator = tileDifference
    console.log(`Start Vertical Check`)
    for (var i:number = 1; i < 5; i++){
      console.log(`Base: ${baseCase}, Compared-${iterator}: ${baseCase - iterator}`)
      if (state.moves.includes(baseCase - iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase - iterator) % 2 === 0)){
          counter += 1
          console.log(`111111Base: ${baseCase}, Compared-${iterator}: ${baseCase - iterator} `)
          iterator += tileDifference
        }
      } else break
      
    }
    iterator = tileDifference
    for (var i:number = 1; i < 5; i++){
      console.log(`VertBase: ${baseCase}, Compared-${iterator}: ${baseCase + iterator}`)
      if (state.moves.includes(baseCase + iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase + iterator) % 2 === 0)){
          counter += 1
          console.log(`Vert 111111Base: ${baseCase}, Compared-${iterator}: ${baseCase + iterator} `)
          iterator += tileDifference
        }
      } else break
      
    }
    console.log(`Counter: ${counter}`)
  }

  function checkDiagonalTopLeftBottomRight(baseCase: number){
    if (!baseCase) return
    const tileDifference = state.size + 1
    var counter = 1
    var iterator = tileDifference
    console.log(`Start Vertical Check`)
    for (var i:number = 1; i < 5; i++){
      console.log(`Base: ${baseCase}, Compared-${iterator}: ${baseCase - iterator}`)
      if (state.moves.includes(baseCase - iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase - iterator) % 2 === 0)){
          counter += 1
          console.log(`111111Base: ${baseCase}, Compared-${iterator}: ${baseCase - iterator} `)
          iterator += tileDifference
        }
      } else break
      
    }
    iterator = tileDifference
    for (var i:number = 1; i < 5; i++){
      console.log(`VertBase: ${baseCase}, Compared-${iterator}: ${baseCase + iterator}`)
      if (state.moves.includes(baseCase + iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase + iterator) % 2 === 0)){
          counter += 1
          console.log(`Vert 111111Base: ${baseCase}, Compared-${iterator}: ${baseCase + iterator} `)
          iterator += tileDifference
        }
      } else break
      
    }
    console.log(`Counter: ${counter}`)
    if (counter >= 5) return true
  }
  function checkDiagonalBottomLeftTopRight(baseCase: number){
    if (!baseCase) return
    const tileDifference = state.size - 1
    var counter = 1
    var iterator = tileDifference
    console.log(`Start Vertical Check`)
    for (var i:number = 1; i < 5; i++){
      console.log(`Base: ${baseCase}, Compared-${iterator}: ${baseCase - iterator}`)
      if (state.moves.includes(baseCase - iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase - iterator) % 2 === 0)){
          counter += 1
          console.log(`111111Base: ${baseCase}, Compared-${iterator}: ${baseCase - iterator} `)
          iterator += tileDifference
        }
      } else break
      
    }
    iterator = tileDifference
    for (var i:number = 1; i < 5; i++){
      console.log(`VertBase: ${baseCase}, Compared-${iterator}: ${baseCase + iterator}`)
      if (state.moves.includes(baseCase + iterator)){
        if ((indexOfTile(baseCase) % 2 === 0) === (indexOfTile(baseCase + iterator) % 2 === 0)){
          counter += 1
          console.log(`Vert 111111Base: ${baseCase}, Compared-${iterator}: ${baseCase + iterator} `)
          iterator += tileDifference
        }
      } else break
      
    }
    console.log(`Counter: ${counter}`)
    if (counter >= 5) return true
  }

  const togglePlayer = () => {
    
    setPlayerMessage(`Current Player: ${player}`)
    if (!gameEnd) {
      player === "Black" ? setPlayer("White") : setPlayer("Black");
    } 
    else if (state.moves.length == (state.size * state.size)){
      setPlayerMessage('Draw')
    } 
    else setPlayerMessage(`Winner: ${state.winner}`)
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
