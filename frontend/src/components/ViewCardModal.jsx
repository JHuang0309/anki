import { useState, useEffect } from 'react'
import axios from 'axios';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

const ViewCardModal = ({ closeModal, cardId }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [answer, setAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false)

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
        <div 
          className="fixed inset-0 z-10 w-screen overflow-y-auto"
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-4">
            <DialogPanel
              transition
              className="relative transdiv overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all 
                        data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 
                        data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:max-h-[85vh] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95
                        flex flex-col justify-between overflow-y-auto"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:py-6 sm:px-4 sm:pb-4">
                <div className="mt-3 text-center sm:mx-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        {title}
                    </DialogTitle>
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
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-end">
                <button
                  type="button"
                  data-autofocus
                  onClick={closeModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      
    );
  };
  
  export default ViewCardModal