import { useState, memo } from "react";
import { BoardActionType, TILE_STATUS } from "../constants";
import { BoardAction } from "../types";

import style from "./Tile.module.css";

type TileProps = {
  id: number;
  isSelected?: boolean;
  dispatch: React.Dispatch<BoardAction>;
  player?: string;
  text?: string;
};

const getClassNames = (status: TILE_STATUS) => {
  const className = style.tile;
  switch (status) {
    case TILE_STATUS.BLACK:
      return `${className} ${style.black}`;
    case TILE_STATUS.WHITE:
      return `${className} ${style.white}`;
    default:
      return `${className} ${style.available}`;
  }
};

export default memo(function Tile(props: TileProps) {
  const { id, isSelected = false, player, text, dispatch} = props;
  const [status, setStatus] = useState(
    isSelected ? TILE_STATUS.SELECTED : TILE_STATUS.AVAILABLE
  );


  

  const handleClick = () => {
    console.log(player);
    if (!isSelected) {
      if (status === TILE_STATUS.AVAILABLE && player === "Black") {
        setStatus(TILE_STATUS.BLACK);
        dispatch({ type: BoardActionType.SELECT, payload: id });
      } else if (status === TILE_STATUS.AVAILABLE && player === "White") {
        setStatus(TILE_STATUS.WHITE);
        dispatch({ type: BoardActionType.SELECT, payload: id });
      }
    }
  };

  return (
    <div className={getClassNames(status)} onClick={handleClick}>
      {text}
    </div>
  );
});
