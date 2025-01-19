import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

import Alert from '../components/Alert.jsx';

const PageRegister = ({ token, setTokenFn}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [name, setName] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('error');
    const [alertMsg, setAlertMsg] = useState('');

    const navigate = useNavigate();
    // Redirect to users dashboard if already logged in
    useEffect(() => {
        if (localStorage.getItem('token') != null) {
        navigate('/');
        }
    }, []);

    const validInputs = () => {
        // check for empty inputs
        if (email == '' || password == '' || confPassword == '' || name == '') {
          setAlertType('error');
          setAlertMsg('Inputs cannot be empty');
          return false;
        }
        //  check valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setAlertType('error');
          setAlertMsg('Please input a valid email');
          return false;
        }
        // check passwords match
        if (password != confPassword) {
          setAlertType('error');
          setAlertMsg('Passwords must match');
          return false;
        }
        return true;
      }
    
      const register = (event) => {
        event.preventDefault();
        if (!validInputs()) {
          setShowAlert(true);
          return;
        }
        axios.post('http://localhost:5005/admin/auth/register', {
          email: email,
          password: password,
          name: name,
        })
          .then(res => {
            localStorage.setItem('token', res.data.token);
            setTokenFn(res.data.token);
            navigate('/');
          })
          .catch(res => {
            console.error("Unexpected error:", res);
            setAlertType('error');
            setAlertMsg(res.response.data.error);
            setShowAlert(true);
          })
      }

	return (
		<>
            {showAlert && (
                <Alert 
                message={alertMsg}
                type={alertType}
                onClose={() => setShowAlert(false)}
                />
            )}        
            <div className="mx-auto max-w-2xl text-center mt-10">
                <h2 className="text-balance text-4xl font-semibold sm:text-5xl">Welcome to Anki!</h2>
                <p className='mt-2 text-lg/8 text-gray-600'>Let&#39;s get you signed up</p>
            </div> 
            <form className="mx-auto mt-10 max-w-xl sm:mt-10 px-10">
                <div>
                <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">Email</label>
                <div className='mt-1.5 mb-2.5'>
                    <input 
                    id='email'
                    name='email'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#2563eb] sm:text-sm/6"
                    />
                </div>
                </div>
                <div>
                <label htmlFor="password" className="block text-sm/6 font-semibold text-gray-900">Password</label>
                <div className='mt-1.5 mb-2.5'>
                    <input 
                    id='password'
                    name='password'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#2563eb] sm:text-sm/6"
                    />
                </div>
                </div>
                <div>
                <label htmlFor="confirmPassword" className="block text-sm/6 font-semibold text-gray-900">Confirm Password</label>
                <div className='mt-1.5 mb-2.5'>
                    <input 
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    value={confPassword}
                    onChange={e => setConfPassword(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#2563eb] sm:text-sm/6"
                    />
                </div>
                </div>
                <div>
                <label htmlFor="name" className="block text-sm/6 font-semibold text-gray-900">Name</label>
                <div className='mt-1.5 mb-2.5'>
                    <input 
                    id='name'
                    name='name'
                    type='text'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#2563eb] sm:text-sm/6"
                    />
                </div>
                </div>
                <div className='mt-10'>
                <button
                    type='submit'
                    className="block w-full rounded-md bg-[#2563eb] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#3b82f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={register}
                > 
                    Register
                </button>
                </div>
                <div className='flex flex-start mt-5'>
                <span className="text-sm/6 text-gray-600">Already have an account?  <Link className="font-semibold text-[#2563eb] hover:text-[#3b82f6]" to="/login">Sign in here</Link></span>
                
                </div>
            </form>
		</>
	);
}

export default PageRegister;