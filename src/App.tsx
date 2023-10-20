import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const inputRef = useRef<HTMLInputElement|null>(null);
  const [file, setFile] = useState<any>(null);
  const allVideos = '.mp4';
  const handleSelect = () => {
    inputRef.current?.click();
  }
  
  const handleInputChange = (e:any) => {
    setFile(e.target.files[0]);
  }

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const data = new FormData();
    if ( !file ) {
      toast.warn('You have to select video file first');
      return;
    }
    data.append('file', file);
    fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: data,
    }).then( async (res) => {
      console.log(res);
    }).catch(err => {
      console.log(err);
      toast.error('Server Error: Please try later');
    });
  }


  return (
    <div className={`App min-h-screen bg-white`}>
      <div className={`w-full bg-slate-900 py-2 px-4 justify-between flex flex-row`}>
        <h1 className={`text-4xl font-bold text-white`}>Welcome Remove-BG App!</h1>
      </div>
      <form className='mt-8 py-2 px-6 w-full text-center' onSubmit={handleSubmit}>
        <div>
          <label className='text-2xl text-teal-900'>Please select video file:</label>
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-7 py-2 text-center mr-2 mb-2 ml-2" onClick={handleSelect}>Select</button>
          <input type='file' name='file' className='hidden' accept={allVideos} ref={inputRef} onChange={handleInputChange}/>
        </div>
        <div>
          <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 w-200 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-7 py-2 text-center mr-2 mb-2 ml-2">Remove BG</button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
