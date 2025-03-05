import { useState, useEffect } from 'react'
import axios from 'axios';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

const Modal = ({ closeModal, createCard, updateCard, deckId, cardId, modalType }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [type, setType] = useState('multiple-choice');
    const [desc, setDesc] = useState('');
    const [answer, setAnswer] = useState('');

    const handleCreateCard = () => {
        const cardDetails = {
            title: title,
            topic: topic,
            difficulty: difficulty,
            type: formatCardType(type),
            desc: desc,
            answer: answer,
            deckId: deckId,
        }
        createCard(cardDetails);
    }

    const handleUpdateCard = () => {
      const cardDetails = {
          id: cardId,
          title: title,
          topic: topic,
          difficulty: difficulty,
          type: formatCardType(type),
          desc: desc,
          answer: answer,
          deckId: deckId,
      }
      updateCard(cardDetails);
  }

    const formatCardType = (type) => {
        if (type === 'multiple-choice') {
            return('MC');
        } else if (type === 'short-answer') {
            return('SA');
        } else {
            return('LR');
        }
    }

    const rawCardType = (type) => {
      if (type === 'MC') {
          return('multiple-choice');
      } else if (type === 'SA') {
          return('short-answer');
      } else {
          return('long-response');
      }
  }

    const populateModal = () => {
      axios.get('http://localhost:5005/card', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { cardId: cardId },
      })
        .then(res => {
          const card = res.data.card[0]
          setTitle(card.title)
          setTopic(card.topic)
          setDifficulty(card.difficulty)
          setType(rawCardType(card.type))
          setDesc(card.desc)
          setAnswer(card.answer)
        })
        .catch(res => {
          console.error("Unexpected error:", res);
        })
    }

    useEffect(() => {
        // populate card if cardId not null
        if (cardId) {
          populateModal();
        }
    }, [])

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-4">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all 
                        data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 
                        data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:max-h-[85vh] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95
                        flex flex-col justify-between overflow-y-auto"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:py-6 sm:px-4 sm:pb-4">
                <div className="mt-3 text-center sm:mx-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        Create new question card
                    </DialogTitle>
                    <div className='mt-1.5 mb-2.5'>
                        <input 
                            id='title'
                            name='title'
                            type='text'
                            defaultValue={title}
                            placeholder='Write your question here'
                            onChange={e => setTitle(e.target.value)}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#2563eb] sm:text-sm/6"
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className='sm:col-span-2'>
                    <label htmlFor="topic" className="block text-sm/6 font-medium text-gray-900">
                    Topic
                    </label>
                    <input
                    id="topic"
                    name="topic"
                    type="text"
                    defaultValue={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="block px-3.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6"
                    />
                </div>
                <div className='sm:col-span-2'>
                    <label htmlFor="difficulty" className="block text-sm/6 font-medium text-gray-900">
                    Difficulty
                    </label>
                    <select
                    id="difficulty"
                    name="difficulty"
                    onChange={e => setDifficulty(e.target.value)}
                    value={difficulty}
                    className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div className='sm:col-span-2'>
                    <label htmlFor="type" className="block text-sm/6 font-medium text-gray-900">
                    Question Type
                    </label>
                    <select
                    id="type"
                    name="type"
                    onChange={e => setType(e.target.value)}
                    value={type}
                    className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm/6"
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="short-answer">Short Answer</option>
                        <option value="long-response">Long Response</option>
                    </select>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                    Question description
                    </label>
                    <textarea
                    id="description"
                    name="description"
                    type="textarea"
                    rows={4}
                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm/6"
                    defaultValue={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="Enter additional question text here..."
                    />
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="answer" className="block text-sm/6 font-medium text-gray-900">
                    Answer
                    </label>
                    <textarea
                    id="answer"
                    name="answer"
                    type="textarea"
                    rows={5}
                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm/6"
                    defaultValue={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Write the correct answer here..."
                    />
                </div>
                </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-between">
                <button
                  type="button"
                  onClick={modalType === "Create" ? handleCreateCard : handleUpdateCard}
                  className="inline-flex w-full justify-center rounded-md bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3b82f6] sm:w-auto"
                >
                  {modalType}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={closeModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      
    );
  };
  
  export default Modal