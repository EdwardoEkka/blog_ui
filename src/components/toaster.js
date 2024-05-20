import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  
  function Toaster({}){
    const notify = () => toast("Thanks! We saved your changes.!");

    return (
      <div>
        <button onClick={notify}>Notify!</button>
        <ToastContainer 
          className="toaster-container"
          position="top-right"
          autoClose={111111100}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover/>
      </div>
    );
  }

  export default Toaster;