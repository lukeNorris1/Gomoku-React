import { useContext, useReducer } from 'react'
import style from './Home.module.css'
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context'





export default function Home() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
    console.log("test")
    if (!user) return <Navigate to='/login' replace/>

  return (
    
    <div className='container'>
        <h1>Home</h1>
    </div>
  )
}

