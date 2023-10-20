import { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { REACT_APP_BACKENT_API } from './constant';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {

  const inputRef = useRef<HTMLInputElement|null>(null);
  const [file, setFile] = useState<any>(null);
  const [filename, setFilename] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const allVideos = '.mp4';
  const handleSelect = () => {
    inputRef.current?.click();
  }

  useEffect(() => {
    if ( file ) {
      setFilename(file.name);
    }
  },[file])
  
  const handleInputChange = (e:any) => {
    setFile(e.target.files[0]);
  }
  const downloadVideo = (url: string) => {
    const ele = document.createElement('a');
    ele.href = url;
    ele.setAttribute('download', 'true');
    ele.click();
  }
  const handleSubmit = (e:any) => {
    e.preventDefault();
    const data = new FormData();
    if ( !file ) {
      toast.warn('You have to select video file first');
      return;
    }
    setLoading(true);
    data.append('file', file);
    fetch(`${REACT_APP_BACKENT_API}:8000/upload`, {
      method: 'POST',
      body: data,
    }).then(bb =>  bb.blob()).then( async (res) => {
      const blobURL = URL.createObjectURL(res);
      downloadVideo(blobURL);
      toast.success('Background is removed successfully');
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
      toast.error('Server Error: Please try later');
    });
  }


  return (
    <div className={`App min-h-screen bg-white`}>
      <div className={`w-full bg-slate-900 py-2 px-4 justify-between flex flex-row`}>
        <h1 className={`text-4xl font-bold text-white`}>Welcome Remove-BG App!</h1>
      </div>
      <form className='mt-8 py-2 px-6 w-full text-center' onSubmit={handleSubmit}>
        {
          loading? <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>:<div>
          <div>
            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-7 py-2 text-center mr-2 mb-2 ml-2" onClick={handleSelect}>Select Video</button>
            {
              filename.trim().length > 0 &&  <span className='text-2xl font-bold text-slate-900'>{filename}</span>
            }
            <input type='file' name='file' className='hidden' accept={allVideos} ref={inputRef} onChange={handleInputChange}/>
          </div>
          <div>
            <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 w-200 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-7 py-2 text-center mr-2 mb-2 ml-2">Remove BG</button>
          </div>
        </div>
        }
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
