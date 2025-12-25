import React from 'react'
import logo from '../assets/logo.png'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-[max(10%,80px)]' src={logo} alt="logo" />
        <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:py-2 sm:px-7 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar