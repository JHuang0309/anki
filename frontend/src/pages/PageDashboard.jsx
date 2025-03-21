import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Component imports

import Modal from '../components/DeckModal';
import AlertModal from '../components/AlertModal';

const PageDashboard = ({ token, setTokenFn}) => {

  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [decks, setDecks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [deckId, setDeckId] = useState(null)

  // functions
  const loadUserData = () => {
    axios.get('http://localhost:5005/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Example token retrieval
      },
    })
      .then(res => {
        setUserName(res.data.name)
        setDecks(res.data.decks)
      })
      .catch(res => {
        console.error("Unexpected error:", res);
      })
  };


  const createDeck = () => {
    setShowModal(true);
  }

  const createNewDeck = (title) => {
    axios.post('http://localhost:5005/create/deck', 
      {
        title: title,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then(()=> {
      loadUserData();
      closeModal();
    })
    .catch(res => {
      console.error("Unexpected error:", res);
      // setAlertType('error');
      // setAlertMsg(res.response.data.error);
      // setShowAlert(true);
    })
  }

  const deleteDeck = (id) => {
    axios.delete('http://localhost:5005/delete/deck', 
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { deckId: id },
      },
    )
    .then(()=> {
      closeModal();
      loadUserData();
      setDeckId(null);
    })
    .catch(res => {
      console.error("Unexpected error:", res);
      // setAlertType('error');
      // setAlertMsg(res.response.data.error);
      // setShowAlert(true);
    })
  }

  const closeModal = () => {
    setShowModal(false);
    setShowAlertModal(false);
  }

  // UseEffects
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (deckId) {
      setShowAlertModal(true);
    }
  }, [deckId])

  useEffect(() => {
    if (!token && localStorage.getItem('token') == null) {
      navigate('/login');
    }
  }, [token, navigate]);


  // Component Styles
  const mainStyle= { margin: '3em'};
	return (
		<>
    {showModal && 
      <Modal closeModal={closeModal} createDeck={createNewDeck}/>
    }
    {showAlertModal && 
      <AlertModal closeModal={closeModal} deleteFunc={() => deleteDeck(deckId)}/>
    }
      <h1 className="text-left mx-6 text-2xl px-4 font-semibold">
        Hi <span className='text-[#2563eb]'>{userName}</span>, welcome back to Decki!
      </h1>
      <main style={mainStyle}>
        <div className='mb-5'>
        <button 
          className="w-full bg-blue-100 text-blue-700 font-bold text-left py-3 px-4 rounded-md transition duration-200 hover:bg-blue-200"
          onClick={createDeck}
          >
          Create new deck
        </button>
        </div>
        <div>
        <hr className="border-t border-gray-300 my-6"/>
        <h3 className="text-xl font-semibold text-left mb-2">Deck Library</h3>
          <ul role="list" className="divide-y divide-gray-100">
            {decks.map((deck) => (
              <li key={deck.id} className="flex justify-between gap-x-6 py-5 px-5 hover:bg-gray-100 transition-all duration-300 ease-in-out rounded-md">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto text-left">
                    <p className="text-sm/6 font-semibold text-gray-900">
                    <a 
                      href="#"
                      className="text-gray-900 hover:text-[#2563eb] hover:underline"
                      onClick={() => {
                        const data = {
                          title: deck.title,
                          id: deck.id,
                        }
                        const queryString = new URLSearchParams(data).toString();
                        navigate(`/edit?${queryString}`)
                      }}
                    >
                      {deck.title}
                    </a>
                    </p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">
                      Created at <time dateTime={deck.createdAt}>
                      {new Date(deck.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      </time>
                    </p>
                    <p className="text-xs text-gray-500">{deck.numCards} cards</p>
                  </div>
                </div>
                <div className='sm:flex sm:items-center'>
                  <div className="shrink-0 sm:flex sm:flex-col mr-4">
                    <button 
                      className='text-sm hover:text-[#2563eb]'
                      onClick={() => {
                        const data = {
                          title: deck.title,
                          id: deck.id,
                        }
                        const queryString = new URLSearchParams(data).toString();
                        navigate(`/edit?${queryString}`)
                      }}
                    >Edit</button>
                  </div>
                  <div className="shrink-0 sm:flex sm:flex-col">
                    <button 
                      className='text-gray-400 text-sm hover:text-red-800'
                      onClick={() => setDeckId(deck.id)}
                      >Delete</button>
                  </div>
                </div>
              </li>
            ))}
            <hr className="border-t border-gray-300 my-3"/>
          </ul>
          
        </div>
      </main>
      
		</>
	);
}

export default PageDashboard;