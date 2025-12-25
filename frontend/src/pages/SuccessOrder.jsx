import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const SuccessOrder = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    // Get order data from navigation state or fetch from API
    const stateOrderData = location.state?.orderData
    
    if (stateOrderData) {
      // Order data passed from PlaceOrder (COD)
      setOrderData(stateOrderData)
      setLoading(false)
    } else if (token) {
      // Fetch order data from API (for Stripe redirects via Verify page)
      fetchLatestOrder()
    } else {
      setLoading(false)
    }
  }, [location.state, token, orderId])

  const fetchLatestOrder = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/order/userorders', {
        headers: { token }
      })
      
      if (response.data.success && response.data.orders.length > 0) {
        let targetOrder = null
        
        // If orderId is provided, find that specific order
        if (orderId) {
          targetOrder = response.data.orders.find(order => order._id === orderId)
        }
        
        // If no specific order found or no orderId, get the most recent order
        if (!targetOrder) {
          targetOrder = response.data.orders[0]
        }
        
        if (targetOrder) {
          setOrderData({
            items: targetOrder.items,
            amount: targetOrder.amount,
            address: targetOrder.address,
            paymentMethod: targetOrder.paymentMethod,
            status: targetOrder.status,
            date: targetOrder.date
          })
        }
      }
    } catch (error) {
      console.log('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className='border-t pt-16 border-gray-400 min-h-[60vh] flex flex-col items-center justify-center'>
        <p className='text-gray-500 mb-4'>No order data found</p>
        <button
          onClick={() => navigate('/orders')}
          className='bg-black text-white px-8 py-3 cursor-pointer active:bg-gray-700'
        >
          View Orders
        </button>
      </div>
    )
  }

  return (
    <div className='border-t pt-16 border-gray-400 min-h-[80vh]'>
      <div className='max-w-4xl mx-auto'>
        {/* Thank You Message */}
        <div className='text-center mb-12'>
          <div className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            Thank You for Shopping with Forever!
          </div>
          <p className='text-gray-600 text-lg'>
            Your order has been placed successfully
          </p>
        </div>

        {/* Order Details */}
        <div className='mb-8'>
          <div className='text-2xl mb-6'>
            <Title text1={'ORDER'} text2={'DETAILS'} />
          </div>

          {/* Order Items */}
          <div className='space-y-4 mb-6'>
            {orderData.items && orderData.items.map((item, index) => (
              <div
                key={index}
                className='flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded'
              >
                <img
                  src={item.image?.[0] || item.image}
                  alt={item.name}
                  className='w-24 h-24 object-cover rounded'
                />
                <div className='flex-1'>
                  <p className='font-medium text-lg mb-2'>{item.name}</p>
                  <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                    <p>Price: <span className='font-medium'>{currency} {item.price}</span></p>
                    <p>Quantity: <span className='font-medium'>{item.quantity}</span></p>
                    <p>Size: <span className='font-medium'>{item.size}</span></p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>
                    {currency} {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className='border-t border-gray-300 pt-6 mb-6'>
            <div className='space-y-3'>
              <div className='flex justify-between text-gray-700'>
                <p>Subtotal:</p>
                <p>{currency} {(orderData.amount || 0).toFixed(2)}</p>
              </div>
              <div className='flex justify-between text-lg font-semibold border-t border-gray-300 pt-3'>
                <p>Total Amount:</p>
                <p>{currency} {(orderData.amount || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {orderData.address && (
            <div className='mb-6 p-4 bg-gray-50 rounded'>
              <p className='font-medium mb-3'>Delivery Address:</p>
              <div className='text-gray-700 text-sm space-y-1'>
                <p>{orderData.address.firstName} {orderData.address.lastName}</p>
                <p>{orderData.address.street}</p>
                <p>
                  {orderData.address.city}, {orderData.address.state} {orderData.address.zipcode}
                </p>
                <p>{orderData.address.country}</p>
                <p className='mt-2'>Phone: {orderData.address.phone}</p>
                <p>Email: {orderData.address.email}</p>
              </div>
            </div>
          )}

          {/* Payment Method & Status */}
          <div className='flex flex-wrap gap-6 text-sm'>
            <div>
              <p className='text-gray-600'>Payment Method:</p>
              <p className='font-medium'>
                {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe'}
              </p>
            </div>
            {orderData.status && (
              <div>
                <p className='text-gray-600'>Order Status:</p>
                <p className='font-medium'>{orderData.status}</p>
              </div>
            )}
            {orderData.date && (
              <div>
                <p className='text-gray-600'>Order Date:</p>
                <p className='font-medium'>{new Date(orderData.date).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Button */}
        <div className='text-center mt-8'>
          <button
            onClick={() => navigate('/orders')}
            className='bg-black text-white px-12 py-3 text-lg cursor-pointer active:bg-gray-700 hover:bg-gray-800 transition-colors'
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessOrder

