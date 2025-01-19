import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Logout = ({ token, setTokenFn}) => {

  const navigate = useNavigate();

  const logout = () => {  
    axios.post('http://localhost:5005/admin/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}`}
    })
      .then(() => {
        localStorage.removeItem('token');
        setTokenFn(null);
        navigate('/login');
      })
      .catch(res => {
        // console.log(res.response.data.error);
        localStorage.removeItem('token');
        setTokenFn(null);
        navigate('/login');
      })
  };

  return (
    <button 
      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      onClick={logout}
    >
      Logout
    </button>
  );
  
}



export default Logout