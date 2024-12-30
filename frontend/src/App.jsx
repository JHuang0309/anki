import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backend, setBackend] = useState([{}])

  useEffect(() => {
    fetch("/api").then(res => res.json()).then(data => setBackend(data))
  }, [])

  return (
    <>
      {(typeof backend.users === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        backend.users.map((user, index) => (
          <p key={index}>{user}</p>
        ))
      )}
    </>
  )
}

export default App
