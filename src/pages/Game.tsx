import { useState, useContext, useReducer } from 'react'
import { useLocation } from 'react-router-dom'
import style from './Game.module.css'
import { BoardContext } from '../context'

export default function Game() {
    // const location = useLocation()
    // console.log(`ree ${localStorage.length}`)
    // console.log(`local storage ${localStorage.key}`)
    
    
    // const { board } = useContext(BoardContext)
    // console.log(board?.boardSize || "bad")
    

  return (
    <div className='container'>
        <h1 className="style.action">Game</h1>
    </div>
  )
}

