import { useState, useEffect } from 'react';
import axios from 'axios';

const PageDashboard = ({ token, setTokenFn}) => {

  const [userName, setUserName] = useState('');

  const loadUserData = () => {
    axios.get('http://localhost:5005/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Example token retrieval
      },
    })
      .then(res => {
        console.log("It worked:", res);
        setUserName(res.data.name)
      })
      .catch(res => {
        console.error("Unexpected error:", res);
      })
  };

  // TODO: Create a new subject
  // Bring up a modal
  // 

  useEffect(() => {
    loadUserData();
  }, []);

	return (
		<>
        {/* {(typeof backend.users === 'undefined') ? (
                <p>Loading...</p>
              ) : (
                backend.users.map((data, index) => (
                  <p key={index}>{data}</p>
                ))
              )} */}
              <h1>
                Hi {userName}
              </h1>
		</>
	);
}

export default PageDashboard;