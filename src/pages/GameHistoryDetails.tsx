import { useParams } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage } from "../hooks";
import { Navigate, useNavigate } from "react-router-dom";

import style from "./GameHistoryDetails.module.css";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

export default function GameHistoryDetails() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [idCheck, setIdCheck] = useState(boardId?.split(":")[1]);
  const [boards] = useLocalStorage<Record<string, number[]>>(`boards`, {});



  // ToDO How to add appropriate board using only the index from the boards local storage
  //USE THIS- ------------------------
  //console.log(`board ${boards[key]}`);


  console.log(`Board: ${boardId?.split(":")[1]}`);
  console.log("gameHistoryDetails");
  // Object.keys(boards)
  //   .filter((board) => idCheck === board.split("-")[1])
  //   .map((board) => {
  //     console.log(`boardTest ${board}`);
  //   });
  return (
    <div>
      {`Board number = ${boardId}`}
      {Object.keys(boards).map((key) => {
        const sessionId = key.split("-")[1];
        console.log(`Session id = ${sessionId}`);
        console.log(`Check = ${idCheck == sessionId}`);
        return (
          <div className={style.list} key={key}>
            <p className={style.title}>111</p>
            <p>222</p>
            <button
              className={style.button}
              onClick={() => navigate(`/session/${sessionId}`)}
            >
              View/Edit
            </button>
          </div>
        );
      })}
    </div>
  );
}
