import { useState, useContext, useReducer } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import style from './Game.module.css'
import { BoardContext } from '../context'

export default function Game() {
  console.log("load game")

    const { board } = useContext(BoardContext)
    if (!board?.boardSize) return <Navigate to='/' replace/>
    console.log(board?.boardSize)
    

    

  return (
    <div className='container'>
        <h1 className="style.action">{board?.boardSize}</h1>
    </div>
  )
}

