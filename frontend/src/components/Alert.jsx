const Alert = ({message, type, onClose }) => {
    const alertType = {
      error: 'bg-red-100 text-red-700',
      success: 'bg-green-100 text-green-700',
      alert: 'bg-yellow-100 text-yellow-700', // used for modal invalid inputs
    }
    const closeIcon = (alertType) => {
      if (alertType == 'error') {
        return 'ml-4 text-red-500 hover:text-red-700';
      } else if (alertType == 'success') {
        return 'ml-4 text-green-500 hover:text-green-700';
      } else if (alertType == 'alert') {
        return 'ml-4 text-yellow-500 hover:text-yellow-700';
      }
    }
    return (
      <div className='fixed flex w-full justify-center z-50 '>
        <div className={`flex items-center p-4 mb-4 rounded-md min-w-[350px] md:min-w-[500px] ${alertType[type]}`}>
          <div className='flex-grow'>{message}</div>
          <button onClick={onClose} className={closeIcon(alertType[type])}>
            &times;
          </button>
        </div>
      </div>
      
    );
  };
  
  export default Alert