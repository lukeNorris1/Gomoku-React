import { useState, memo } from "react";
import { TILE_STATUS } from "../constants";
import { BoardAction } from "../types";

import style from "./Tile.module.css";

type SeatProps = {
  id: number;
  isSelected?: boolean;
  dispatch: React.Dispatch<BoardAction>;
  player: string;
};

const getClassNames = (status: TILE_STATUS) => {
  const className = style.seat;
  switch (status) {
    case TILE_STATUS.AVAILABLE:
      return `${className} ${style.available}`;
    case TILE_STATUS.SELECTED:
      return `${className} ${style.selected}`;
    case TILE_STATUS.BLACK:
      return `${className} ${style.black}`;
    case TILE_STATUS.WHITE:
      return `${className} ${style.white}`;
    default:
      return className;
  }
};

export default memo(function Tile(props: SeatProps) {
  const { id, isSelected = false, player } = props;
  const [status, setStatus] = useState(TILE_STATUS.AVAILABLE);

  const handleClick = () => {
    console.log(player);
    if (status === TILE_STATUS.AVAILABLE && player === "Black") {
      setStatus(TILE_STATUS.BLACK);
    } else if (status === TILE_STATUS.AVAILABLE && player === "White") {
      setStatus(TILE_STATUS.WHITE);
    }
  };

  return <div className={getClassNames(status)} onClick={handleClick} />;
});
