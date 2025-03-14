import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

const PagePlay = () => {
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const [deckTitle, setdeckTitle] = useState(queryParams.get("title"))
    const [cards, setCards] = useState([]);
    const [viewCardIndex, setViewCardIndex] = useState(0)
    const [title, setTitle] = useState('');
    const [id, setId] = useState(queryParams.get("id"))
    const [desc, setDesc] = useState('');
    const [answer, setAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false)
    const [deckLen, setDeckLen] = useState(0)

    const fetchCards = () => {
      axios.get('http://localhost:5005/cards', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example token retrieval
          },
          params: { deckId: id },
      })
      .then(res => {
        setCards(shuffleCards(res.data.cards));
        setDeckLen(res.data.cards.length)
      })
      .catch(res => {
        console.error("Unexpected error:", res);
      })
    }

  const shuffleCards = (cards) => {
    let shuffledArray = [...cards];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
  }

  const handleNavCards = (direction) => {
    const cur = viewCardIndex
    if (direction == 'prev') {
      if (cur > 0) {
        setViewCardIndex(cur - 1);
        setShowAnswer(false);
      }
    } else {
      if (cur < deckLen) {
        setViewCardIndex(cur + 1);
        setShowAnswer(false);
      }
    }
  }

  // UseEffects

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const viewCard = cards[viewCardIndex]
    if (viewCard) {
      setTitle(viewCard.title)
      setDesc(viewCard.desc)
      setAnswer(viewCard.answer)
    }
  }, [cards])

  useEffect(() => {
    const viewCard = cards[viewCardIndex]
    if (viewCard) {
      setTitle(viewCard.title)
      setDesc(viewCard.desc)
      setAnswer(viewCard.answer)
    }
  }, [viewCardIndex])

  const mainStyle= { margin: '3em', marginTop: '1em'};
	return (
		<>
      <main style={mainStyle}>
        <div className='flex justify-between'>
            <button 
              className='text-sm text-gray-400 hover:text-blue-700'
              onClick={() => { navigate(`/`) }}
            >Return</button>
            <h1 className='font-bold text-xl'>{deckTitle}</h1>
            <button 
              className='text-sm bg-blue-100 text-blue-700 py-1 px-2 rounded-md transition duration-200 hover:bg-blue-200'
              onClick={() => {
                setCards(shuffleCards(cards))
                setViewCardIndex(0);
                setShowAnswer(false);
              }}
            >Reshuffle</button>
        </div>
      <hr className="border-t border-gray-300 my-4"/>
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-4">
              <div className="flex min-h-[100%] min-w-[100%] flex-col bg-white px-4 pb-4 pt-5 sm:py-6 sm:px-4 sm:pb-4">
                <div className="mt-3 text-center sm:mx-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold text-gray-900">
                        {title}
                    </h3>
                    <div className='mt-1.5 mb-2.5 text-sm text-gray-900' style={{ whiteSpace: 'pre-line' }}>
                        {desc}
                    </div>
                    <hr className="border-t border-blue-300 my-3"/>
                    {!showAnswer &&
                        <button 
                            className='text-sm text-gray-500 hover:text-blue-700'
                            onClick={() => setShowAnswer(true)}
                        >Show Answer</button>
                    }
                    {showAnswer &&
                      <>
                        <button 
                            className='text-sm text-gray-400 hover:text-blue-700'
                            onClick={() => setShowAnswer(false)}
                          >Hide Answer</button>
                          <div
                            className='border border-gray-300 p-3 rounded-sm mt-4'
                            style={{ whiteSpace: 'pre-line' }}
                          >
                            {answer}
                          </div>
                      </>
                    }
                    </div>
                  <div className="py-6 sm:flex sm:flex-row sm:px-4 justify-between">
                    <button
                      type="button"
                      data-autofocus
                      className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto ${viewCardIndex === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={viewCardIndex === 0}
                      onClick={() => handleNavCards('prev')}
                    >
                      Previous
                    </button>
                    <p className='flex text-sm text-gray-400 items-center'>{viewCardIndex + 1}/{deckLen}</p>
                    <button
                      type="button"
                      data-autofocus
                      className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto ${viewCardIndex === deckLen - 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={viewCardIndex === deckLen - 1}
                      onClick={() => handleNavCards('next')}
                    >
                      Next
                    </button>
                  </div>  
              </div>
          </div>
      </main>
            
		</>
	);
}

export default PagePlay;