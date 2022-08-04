import { useState, useContext,  } from 'react'
//useReducer
//import { useLocalStorage } from '../hooks'
import style from './Home.module.css'
import { useNavigate,  } from 'react-router-dom'
//Navigate, Link, useLocation
import { UserContext, BoardContext } from '../context'





export default function Home() {
  const { user } = useContext(UserContext)
  
  const size = 5
  const { changeBoard } = useContext(BoardContext)
  console.log(changeBoard)
  //changeBoard(size)


  // console.log(user?.username || "no username")
  //   //if (!user) return <Navigate to='/login' replace/>
  // const navigate = useNavigate()
  // const [boardSize, setBoardSize] = useState(1);

  // function goToGame() {
  //   console.log(`board size = ${boardSize}`)
  //   navigate('/game');
  // }

  return (   
    <div className={style.container}>
        {/* <select className={style.dropdown} 
          onChange={(e) => setBoardSize(parseInt(e.currentTarget.value, 10))}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button onClick={goToGame}>Start</button> */}
    </div>
    
  )
}

