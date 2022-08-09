import style from "./GameHistory.module.css";
import { useLocalStorage } from "../hooks";
import { useContext } from "react";

export default function GameHistory() {
  const [boards] = useLocalStorage<Record<string, number[]>>("boards", {});
  console.log("gameHistory");

  return (
    <div className="container">
      <h1>You have {Object.keys(boards).map((key) => key)} bookings</h1>
    </div>
  );
}
