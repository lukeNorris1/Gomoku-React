import style from "./GameHistory.module.css";
import { useLocalStorage } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function GameHistory() {
  const navigate = useNavigate();
  const [boards] = useLocalStorage<Record<string, number[]>>("boards", {});

  const currentDate = new Date();
  const dateFormatted = `
    ${currentDate.getDate()}/
    ${currentDate.getMonth() + 1}/
    ${currentDate.getFullYear()}`.replace(/\s/g, "");

  return (
    <div className={style.container}>
      {Object.keys(boards).map((key, arr) => {
        console.log(`number: ${arr}`)
        if (key != "winners") {
          const sessionId = key.split("-")[1];
          const tileAmount = boards[key].length;
          if (tileAmount === 0) return null;

          return (
            <div className={style.list} key={key}>
              <p className={style.title}>
                {`Game #${sessionId.replace(/\s/g, "")}
               @${dateFormatted}`}
              </p>
              <button
                className={style.button}
                onClick={() => navigate(`/game-log:${sessionId}`)}
              >
                View game log
              </button>
            </div>
          );
        }
      })}
    </div>
  );
}
