import React from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'

const Orders = ({ token }) => {

  const [orders, setOrders] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    setIsLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }

  }

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    
    // Optimistically update UI first
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: newStatus }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
        // Revert on failure
        await fetchAllOrders()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error(error.message)
      // Revert on error
      await fetchAllOrders()
    }
  }

  useEffect(() => {
    if (token) {
      fetchAllOrders()
    }
  }, [token])

  return isLoading ? (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50'>
      <Loading />
    </div>
  ) : orders.length === 0 ? (
    <div className='text-center py-8 text-gray-500'>No orders found</div>
  ) : (
    <div>
      <h3 className='text-lg font-semibold mb-4'>Order Page</h3>
      <div className='flex flex-col gap-4'>
        {orders.map((order) => (
          <div
            key={order._id}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2.2fr_1.1fr] gap-4 items-start border-2 border-gray-200 p-5 md:p-8 text-xs sm:text-sm text-gray-700'
          >
            {/* Left: parcel icon */}
            <div className='flex justify-center sm:justify-start'>
              <img className='w-12' src={assets.parcel_icon} alt='' />
            </div>

            {/* Middle: items + address */}
            <div className='space-y-2'>
              <div className='font-medium'>
                {order.items.map((item, i) => (
                  <p className='py-0.5 text-base' key={i}>
                    {item.name} x {item.quantity}{' '}
                    <span>{item.size}</span>
                    {i !== order.items.length - 1 && ','}
                  </p>
                ))}
              </div>

              <div className='mt-2'>
                <p className='font-semibold text-base'>
                  {order.address.firstName + ' ' + order.address.lastName}
                </p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state},{' '}
                  {order.address.zipCode}, {order.address.country}
                </p>
                <p>{order.address.phone}</p>
              </div>
            </div>

            {/* Right: summary + status select */}
            <div className='flex flex-col items-end gap-1 text-right'>
              <p>
                <span className='font-semibold'>Items: </span>
                {order.items.length}
              </p>
              <p className='text-sm sm:text-base font-semibold'>
                {currency}
                {order.amount}
              </p>
              <p>
                <span className='font-semibold'>Method: </span>
                {order.paymentMethod}
              </p>
              <p>
                <span className='font-semibold'>Payment: </span>
                {order.payment ? 'Done' : 'Pending'}
              </p>
              <p>
                <span className='font-semibold'>Date: </span>
                {new Date(order.date).toLocaleDateString()}
              </p>

              <select value={order.status} onChange={(e) => statusHandler(e, order._id)} className='mt-2 border border-gray-300 rounded px-3 py-1 outline-none text-xs sm:text-sm'>
                <option value='Order Placed'>Order Placed</option>
                <option value='Packing'>Packing</option>
                <option value='Shipped'>Shipped</option>
                <option value='Out for Delivery'>Out for Delivery</option>
                <option value='Delivered'>Delivered</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders