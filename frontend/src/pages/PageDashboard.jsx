import { useState, useEffect } from 'react';
import axios from 'axios';

// import Header from '../components/Header.jsx';

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
  const createNewDeck = () => {
    console.log("Hello");
  }

  const decks = [
    {
      title: 'COMP6080 | Web Front-End Programming',
      createdAt: '2024-01-22T13:23Z',
      deckSize: '20',
    },
    {
      title: 'COMP1531 | Software Engineering Fundamentals',
      createdAt: '2024-02-22T13:23Z',
      deckSize: '25',
    },
    {
      title: 'COMP3331 | Computer Networks and Applications',
      createdAt: '2024-11-22T13:23Z',
      deckSize: '40',
    },
    {
      title: 'ACTL3192 | Reitrement Saving and Spending Over the Lifecycle',
      createdAt: '2024-03-15T13:23Z',
      deckSize: '23',
    },
    {
      title: 'ACTL2131 | Probability and Mathematical Statistics',
      createdAt: '2023-05-10T13:23Z',
      deckSize: '25',
    },
    {
      title: 'COMM1140 | Financial Management',
      createdAt: '2022-03-30T13:23Z',
      deckSize: '32',
    },
  ]

  // UseEffects
  useEffect(() => {
    loadUserData();
  }, []);


  // Component Styles
  const mainStyle= { margin: '3em'};
	return (
		<>
      <h1 className="text-left mx-6 text-2xl font-semibold">
        Hi <span className='text-[#2563eb]'>{userName}</span>, welcome back to Anki!
      </h1>
      <main style={mainStyle}>
        <div className='mb-5'>
        <button 
          className="w-full bg-blue-100 text-blue-700 font-bold text-left py-3 px-4 rounded-md transition duration-200 hover:bg-blue-200"
          onClick={createNewDeck}
          >
          Create new deck
        </button>
        </div>
        <div>
        <hr className="border-t border-gray-300 my-6"/>
        <h3 className="text-xl font-semibold text-left mb-2">Deck Library</h3>
          <ul role="list" className="divide-y divide-gray-100">
            {decks.map((person) => (
              <li key={person.createdAt} className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto text-left">
                    <p className="text-sm/6 font-semibold text-gray-900">
                    <a 
                      href="#" 
                      className="text-gray-900 hover:text-[#2563eb] hover:underline"
                    >
                      {person.title}
                    </a>
                    </p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">
                      Created at <time dateTime={person.createdAt}>
                      {new Date(person.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      </time>
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-500">{person.deckSize} cards</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      
		</>
	);
}

export default PageDashboard;