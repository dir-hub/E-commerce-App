import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartPortal from '../components/CartPortal'
import { toast } from 'react-toastify'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, setCartItems } = useContext(ShopContext)

  const [cartData, setCartData] = useState([])

  const clearCart = () => {

    try {
      setCartItems({})
      toast.success('Cart cleared successfully')
    } catch (error) {
      console.log(error)
      toast.error('Failed to clear cart')
    }


  }

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData)
    }

  }, [cartItems, products])
  return (
    <div className='border-t border-gray-400 pt-14'>
      <div className='text-2x1 mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      {cartData.length > 0 ? (
        <>
          <div>
            {
              cartData.map((item, index) => {
                const productData = products.find((product) => product._id === item._id)

                return (
                  <div
                    key={index}
                    className={`py-4 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 border-gray-200
                ${index !== 0 ? 'border-b' : ''}
                ${index !== cartData.length - 1 ? 'border-t' : ''}
              `}
                  >
                    <div className='flex items-start gap-6'>
                      <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                      <div>
                        <p className='text-sm sm:text-lg font-medium'>{productData.name}</p>
                        <div className='flex items-center gap-5 mt-2'>
                          <p>{currency}{productData.price}</p>
                          <p className='px-2 sm:px-3 sm:py-l border
bg-slate-50'>{item.size}</p>
                        </div>
                      </div>
                    </div>
                    <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 outline-none' type="number" min={1} defaultValue={item.quantity} />
                    <img onClick={() => {
                      updateQuantity(item._id, item.size, 0);
                      toast.success("Item removed from cart");
                    }} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
                  </div>
                )
              })
            }
          </div>
          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-[450px]'>
              <CartPortal />
              <div className='w-full text-end flex gap-2 justify-center'>
                <button onClick={clearCart} className='bg-white active:bg-gray-700  text-black border hover:bg-gray-100 text-sm max-sm:text-xs my-8 px-8 py-3 cursor-pointer'>CLEAR CART</button>
                <button onClick={() => navigate('/place-order')} className='bg-black active:bg-gray-700  text-white text-sm max-sm:text-xs my-8 px-8 py-3 cursor-pointer'>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='text-center py-20'>
          <p className='text-gray-500'>Your cart is empty</p>
        </div>
      )}


    </div>
  )
}

export default Cart