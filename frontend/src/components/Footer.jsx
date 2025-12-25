import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo} alt="" className='mb-5 w-32'/>
                <p className='w-full md:w-2/3  text-gray-600'>
                    Welcome to our e-commerce store, your one-stop destination for the latest fashion trends and high-quality products. We are committed to providing you with an exceptional shopping experience, offering a wide range of items to suit your style and needs.
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1  text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1  text-gray-600'>
                    <li>+1-212-456-7890</li>
                    <li>contact@forever.com</li>
                </ul>
            </div>
        </div>
        <div>
            <hr className='border-gray-200'/>
            <p className='py-5 text-sm text-center text-gray-900'>
                Copyright@forever.com -
                All Right Reserved
            </p>
        </div>
    </div>
  )
}

export default Footer