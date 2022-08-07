import { useState, memo } from 'react'
import { TILE_STATUS } from '../constants'

import style from './Tile.module.css'

type SeatProps = {
  id: number
  isSelected?: boolean
}

const getClassNames = (status: TILE_STATUS) => {
  const className = style.seat
  switch (status) {
    case TILE_STATUS.AVAILABLE:
      return `${className} ${style.available}`
    case TILE_STATUS.SELECTED:
      return `${className} ${style.selected}`
    case TILE_STATUS.OCCUPIED:
      return `${className} ${style.occupied}`
    default:
      return className
  }
}

export default memo(function Tile(props: SeatProps) {
  const { id, isSelected = false } = props
  const [status, setStatus] = useState(
    isSelected ? TILE_STATUS.SELECTED : TILE_STATUS.AVAILABLE
  )

  const handleClick = () => {
    if (status === TILE_STATUS.AVAILABLE) {
      setStatus(TILE_STATUS.SELECTED)
    } else if (status === TILE_STATUS.SELECTED) {
      setStatus(TILE_STATUS.AVAILABLE)
    }
  }

  return <div className={getClassNames(status)} onClick={handleClick} data-testid="seat" />
})