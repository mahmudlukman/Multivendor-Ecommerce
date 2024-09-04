import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useSelector } from 'react-redux'

const App = () => {
  const { user } = useSelector((state: any) => state.auth);
  console.log(user)

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default App
