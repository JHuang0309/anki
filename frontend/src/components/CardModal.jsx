import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

const Modal = ({ closeModal, createCard }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [title, setTitle] = useState('');

    const handleCreateCard = () => {
        // createCard(title);
    }

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all 
                        data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 
                        data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:h-[80vh] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95
                        flex flex-col justify-between"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:py-6 sm:px-4 sm:pb-4">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        Create new question card
                    </DialogTitle>
                    <div className='mt-1.5 mb-2.5'>
                        <input 
                            id='title'
                            name='title'
                            type='text'
                            onChange={e => setTitle(e.target.value)}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-[#2563eb] sm:text-sm/6"
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className='sm:col-span-3'>
                    <label htmlFor="width" className="block text-sm/6 font-medium text-gray-900">
                    Topic
                    </label>
                    <input
                    id="width"
                    name="width"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#e4627d] sm:text-sm/6"
                    />
                </div>
                <div className='sm:col-span-3'>
                    <label htmlFor="height" className="block text-sm/6 font-medium text-gray-900">
                    Difficulty
                    </label>
                    <input
                    id="height"
                    name="height"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#e4627d] sm:text-sm/6"
                    />
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="text" className="block text-sm/6 font-medium text-gray-900">
                    Question description
                    </label>
                    <textarea
                    id="text"
                    name="text"
                    type="textarea"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#e4627d] sm:text-sm/6"
                    defaultValue={''}
                    placeholder="Enter your text here..."
                    />
                </div>
                <div className='sm:col-span-2'>
                    <label htmlFor="fontSize" className="block text-sm/6 font-medium text-gray-900">
                    Font Size (em)
                    </label>
                    <input
                    id="fontSize"
                    name="fontSize"
                    type="text"
                    placeholder='1.0'
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#e4627d] sm:text-sm/6"
                    />
                </div>
                <div className='sm:col-span-2'>
                    <label htmlFor="colour" className="block text-sm/6 font-medium text-gray-900">
                    Font Colour (HEX)
                    </label>
                    <input
                    id="colour"
                    name="colour"
                    type="text"
                    placeholder='#FFFFFF'
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#e4627d] sm:text-sm/6"
                    />
                </div>
                </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-between">
                <button
                  type="button"
                  onClick={() => handleCreateDeck()}
                  className="inline-flex w-full justify-center rounded-md bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3b82f6] sm:w-auto"
                >
                  Create
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