import { useState, useEffect } from 'react'
import './App.css'

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

import PageRegister from './pages/PageRegister.jsx';
import PageLogin from './pages/PageLogin.jsx';
import PageDashboard from './pages/PageDashboard.jsx';
import Logout from './components/Logout.jsx';
import PageEdit from './pages/PageEdit.jsx';
import PagePlay from './pages/PagePlay.jsx';

function App() {

  const [token, setToken] = useState(null);
  const [backend, setBackend] = useState([{}])

  useEffect(() => {
    fetch("/api").then(res => res.json()).then(data => setBackend(data))
  }, [])

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  // useEffect(() => {
  //   fetch("/subjects").then(res => res.json()).then(data => setBackend(data))
  // }, [])

  return (
    <>
      <BrowserRouter>
        <div className='mx-auto flex justify-end p-6 lg:px-8'>
          { token ? (
            <>
              <Link
                to="/"
                className="rounded-md bg-[#2563eb] px-3.5 py-1.5 mx-1 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-[#3b82f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bae6fd] transition duration-300"
              >Dashboard</Link>
              <Logout
                token={token.token}
                setTokenFn={setToken} />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md bg-white px-3.5 py-1.5 mx-1 text-center text-sm/6 font-semibold text-black shadow-sm hover:text-[#3b82f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bae6fd] transition duration-300" 
              >Login</Link>
              <Link 
                to="/register"
                className="rounded-md bg-[#2563eb] px-3.5 py-1.5 mx-1 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-[#3b82f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bae6fd] transition duration-300"
              >Sign up</Link>
            </>
          )}  
        </div>
        <Routes>
          <Route path="/" element={<PageDashboard setTokenFn={setToken}/>} />
          <Route path="/register" element={<PageRegister setTokenFn={setToken}/>} />
          <Route path="/login" element={<PageLogin setTokenFn={setToken}/>}/>
          <Route path="/edit" element={<PageEdit setTokenFn={setToken}/>}/>
          <Route path="/play" element={<PagePlay setTokenFn={setToken}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
