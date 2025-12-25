import React from 'react'

const NewsLetterBox = () => {
    const onSubmitHandler = (event) =>{
        event.preventDefault();
    }
  return (
    <div className='text-center'>
        <p className='text-2xl text-gray-800 font-medium'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>
            Subscribe to our newsletter to get updates on our latest offers!
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-200 pl-3'>
            <input type="email" placeholder='Enter your email' className='w-full sm:flex-1 outline-none' required/>
            <button type='submit' className='text-white bg-black active:bg-gray-700 text-xs px-10 py-4 cursor-pointer'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsLetterBox