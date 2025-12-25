import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export const backendUrl = import.meta.env.VITE_BACKEND_URL

export const currency = "$"
const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer
        position="bottom-left"
        transition={Slide}
        autoClose={1500}
        hideProgressBar={true}
        closeOnClick
        draggable
        theme="light"
        toastClassName="bg-slate-900 text-white rounded-md border border-[#c586a5] uppercase font-semibold tracking-wide toast-font"

      />
      {token === "" ? <Login setToken={setToken} /> : <>
        <Navbar setToken={setToken} />
        <hr className='border-gray-300' />
        <div className='flex w-full'>
          <Sidebar />
          <div className='mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
            <Routes>
              <Route path='/' element={<Navigate to='/orders' />} />
              <Route path='/add' element={<Add token={token} />} />
              <Route path='/list' element={<List token={token} />} />
              <Route path='/orders' element={<Orders token={token} />} />
            </Routes>
          </div>
        </div>
      </>
      }

    </div>
  )
}

export default App