import React, { use, useContext, useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const {backendUrl, currency, token} = useContext(ShopContext)

  const [orderData,setOrderData] = React.useState([])
  const previousOrderDataRef = useRef([])
  const isInitialLoadRef = useRef(true)

  const loadOrderData = async () =>{
    try {
      if(!token){
        console.log('No token available')
        return null;
      }

      
      
      const response = await axios.get(backendUrl + '/api/order/userorders', {headers:{token}})
      
      
      if(response.data.success){
        let allOrdersItem = []
        response.data.orders.map(order=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        
        // Check if status has changed by comparing with previous data
        if (!isInitialLoadRef.current && previousOrderDataRef.current.length > 0) {
          let statusChanged = false
          
          // Create a map of previous orders for easier lookup
          const previousOrdersMap = new Map()
          previousOrderDataRef.current.forEach((item, index) => {
            // Create a unique key using name, date, size, and quantity
            const key = `${item.name}_${item.date}_${item.size}_${item.quantity}_${index}`
            previousOrdersMap.set(key, item.status)
          })
          
          // Compare current orders with previous ones
          allOrdersItem.forEach((item, index) => {
            const key = `${item.name}_${item.date}_${item.size}_${item.quantity}_${index}`
            const previousStatus = previousOrdersMap.get(key)
            
            if (previousStatus && previousStatus !== item.status) {
              statusChanged = true
            }
          })
          
          // Also check if new orders were added
          if (allOrdersItem.length !== previousOrderDataRef.current.length) {
            statusChanged = true
          }
          
          if (statusChanged) {
            toast.success('Order status updated successfully')
          } else {
            toast.info('No changes in status. Try again later.')
          }
        } else if (isInitialLoadRef.current) {
          // First load - don't show any status change message
          isInitialLoadRef.current = false
        }
        
        // Update previous data reference
        previousOrderDataRef.current = JSON.parse(JSON.stringify(allOrdersItem))
        setOrderData(allOrdersItem)
      } else {
        console.log('API returned success: false')
        toast.error(response.data.message || 'Failed to load orders')
      }
    } catch (error) {
      console.log('Error loading orders:', error)
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    loadOrderData()
  },[token])
  return (
    <div className='border-t pt-16 border-gray-400'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>
      <div>
        {orderData.length === 0 ? (
          <p className='text-center py-8 text-gray-500'>No orders found</p>
        ) : (
          orderData.map((item,index)=>{
            return <div key={index} className={`py-4 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-gray-200
                ${index !== 0 ? 'border-t' : ''}`}>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'> 
                    <p>{currency} {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                    <p className={`min-w-2 h-2 rounded-full ${
                      item.status === 'Order Placed' ? 'bg-green-400' :
                      item.status === 'Packing' ? 'bg-blue-500' :
                      item.status === 'Shipped' ? 'bg-yellow-500' :
                      item.status === 'Out for Delivery' ? 'bg-orange-500' :
                      item.status === 'Delivered' ? 'bg-green-700' : 'bg-red-500'                      
                    }`}></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border border-gray-200 px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
              </div>
            </div>
          })
        )}
      </div>
    </div>
  )
}

export default Orders