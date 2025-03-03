import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

import Alert from '../components/Alert.jsx';
import Modal from '../components/CardModal';

const PageEdit = ({ token, setTokenFn}) => {
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const [title, setTitle] = useState(queryParams.get("title"))
    const [id, setId] = useState(queryParams.get("id"))
    const [showModal, setShowModal] = useState(false);
    const [cards, setCards] = useState([]);

    const fetchCards = () => {
      axios.get('http://localhost:5005/cards', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example token retrieval
          },
          params: { deckId: id },
      })
      .then(res => {
        setCards(res.data.cards);
      })
      .catch(res => {
        console.error("Unexpected error:", res);
      })
    }

    // const test_cards = [
    //     {
    //         id: '1',
    //       title: 'What is the capital of Japan',
    //       createdAt: '2024-01-22T13:23Z',
    //       type: 'Multiple Choice',
    //       difficulty: 'Easy',
    //     },
    //     {
    //         id: '2',
    //         title: 'What is the iconic dish of Japan',
    //         createdAt: '2024-01-22T13:23Z',
    //         type: 'Multiple Choice',
    //         difficulty: 'Medium',
    //       },
    //       {
    //         id: '3',
    //         title: 'Create an itinerary for Japan',
    //         createdAt: '2024-01-22T13:23Z',
    //         type: 'Short Answer',
    //         difficulty: 'Easy',
    //       },
    //       {
    //         id: '4',
    //         title: 'Explain the reasoning behind the falling yen',
    //         createdAt: '2024-01-22T13:23Z',
    //         type: 'Short Answer',
    //         difficulty: 'Hard',
    //       },

    // ]

    const createCard = () => {
      setShowModal(true);
    }

    const closeModal = () => {
      setShowModal(false);
    }

    const createNewCard = (cardObject) => {
      // console.log('New card title', cardObject.title);
      // Perform a put request
      axios.post('http://localhost:5005/create/card', 
        {
          title: cardObject.title,
          topic: cardObject.topic,
          difficulty: cardObject.difficulty,
          type: cardObject.type,
          desc: cardObject.desc,
          answer: cardObject.answer,
          deckId: id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(()=> {
        closeModal();
        fetchCards();
      })
      .catch(res => {
        console.error("Unexpected error:", res);
        // setAlertType('error');
        // setAlertMsg(res.response.data.error);
        // setShowAlert(true);
      })
    }

    // UseEffects

    useEffect(() => {
        fetchCards();
    }, []);

    const mainStyle= { margin: '3em', marginTop: '1em'};
	return (
		<>
        {showModal && 
            <Modal closeModal={closeModal} createCard={createNewCard} deckId={id}/>
        }
            <main style={mainStyle}>
                <div className='flex justify-between'>
                    <button 
                        className='text-sm text-grey-400 hover:text-blue-700'
                        onClick={() => { navigate(`/`) }}
                        >Return</button>
                    <h1 className='font-bold text-xl'>{title}</h1>
                    <button className='text-sm text-grey-400 hover:text-red-800' >Delete Deck</button>
                </div>
                <hr className="border-t border-gray-300 my-4"/>
                <h3 className="text-xl font-semibold text-left mb-2">View Deck</h3>
                <button 
                  className="w-full bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-md transition duration-200 hover:bg-blue-200 mb-5"
                  onClick={() => console.log("TODO")}
                  >
                  Shuffle and Play
                </button>
                <div className='my-4'>
                <h3 className="text-xl font-semibold text-left mb-2">Your Cards</h3>
                <div>
                    <button
                        className="w-full bg-white text-blue-700 font-bold py-3 px-4 rounded-md transition duration-200 hover:bg-blue-200 border"
                        onClick={createCard}
                    >Create new question card</button>
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                    {cards.map((card) => (
                    <li key={card.id} className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto text-left">
                            <p className="text-sm/6 font-semibold text-gray-900">
                            <a 
                            href="#" 
                            className="text-gray-900 hover:text-[#2563eb] hover:underline"
                            >
                            {card.title}
                            </a>
                            </p>
                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                            Created at <time dateTime={card.createdAt}>
                            {new Date(card.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                            </time>
                            </p>
                            <p className="text-xs text-gray-500">{card.type} | {card.difficulty}</p>
                        </div>
                        </div>
                        <div className='sm:flex sm:items-center'>
                        <div className="shrink-0 sm:flex sm:flex-col mr-4">
                            <button 
                            className='text-sm hover:text-[#2563eb]'
                            onClick={() => {
                              console.log("TODO")
                            }}
                            >Edit</button>
                        </div>
                        <div className="shrink-0 sm:flex sm:flex-col">
                            <button className='text-gray-400 text-sm hover:text-red-800'>Delete</button>
                        </div>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </main>
            
		</>
	);
}

export default PageEdit;