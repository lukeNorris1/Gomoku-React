import { useState, useContext,  } from 'react'
//useReducer
//import { useLocalStorage } from '../hooks'
import style from './Home.module.css'
import { useNavigate, Navigate } from 'react-router-dom'
//Navigate, Link, useLocation
import { UserContext, BoardContext } from '../context'





export default function Home() {
  console.log("load Home")
  const { user } = useContext(UserContext)
  const { changeBoard } = useContext(BoardContext)
  const [boardSize, setBoardSize] = useState(1);
  const navigate = useNavigate()
  console.log(`user: ${user?.username}`)
  
  if (!user) return <Navigate to='/login' replace/>
  
  console.log(user?.username || "no username")

  function goToGame() {
    console.log(`board size = ${boardSize}`)
    changeBoard(boardSize)
    navigate('/game');
  }

  return (   
    <div className={style.container}>
        <select className={style.dropdown} 
          onChange={(e) => setBoardSize(parseInt(e.currentTarget.value, 10))}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button onClick={goToGame}>Start</button>
    </div>
    
  )
}

