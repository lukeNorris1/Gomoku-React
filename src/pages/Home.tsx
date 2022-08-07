import { useState, useContext } from "react";
//useReducer
//import { useLocalStorage } from '../hooks'
import style from "./Home.module.css";
import { useNavigate, Navigate } from "react-router-dom";
//Navigate, Link, useLocation
import { UserContext, BoardContext } from "../context";

export default function Home() {
  console.log("load Home");
  const { user } = useContext(UserContext);
  const { changeBoard } = useContext(BoardContext);
  const [boardSize, setBoardSize] = useState(1);
  const navigate = useNavigate();
  console.log(`user: ${user?.username}`);

  console.log(user?.username || "no username");

  function startPress() {
    if (!user) navigate("/login");
    else {
      changeBoard(boardSize);
      navigate("/game");
    }
  }

  return (
    <div className={style.container}>
      <select
        className={style.dropdown}
        onChange={(e) => setBoardSize(parseInt(e.currentTarget.value, 10))}
      >
        {[...Array(15)].map((_, index) => (
          <option key={index + 1} value={index + 1}>{` ${index + 1} x ${
            index + 1
          }`}</option>
        ))}
      </select>
      <button key={1} onClick={startPress}>
        Start
      </button>
    </div>
  );
}
