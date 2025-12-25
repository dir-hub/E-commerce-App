import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartPortal from '../components/CartPortal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method,setMethod] = useState('cod')
  const {navigate,backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee,products} = useContext(ShopContext)
  const [loading, setLoading] = useState(true)
  const [formData,setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:'',
  })

  useEffect(() => {
    if (token) {
      loadProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadProfile = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } })
      if (response.data.success && response.data.profile) {
        const profile = response.data.profile
        // Only pre-fill if profile has data
        if (profile.firstName || profile.email) {
          setFormData({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            street: profile.street || '',
            city: profile.city || '',
            state: profile.state || '',
            zipcode: profile.zipcode || '',
            country: profile.country || '',
            phone: profile.phone || '',
          })
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const saveToProfile = async () => {
    if (!token) {
      toast.error('Please login to save profile')
      return
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/profile/update', formData, { headers: { token } })
      if (response.data.success) {
        toast.success('Profile saved successfully!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to save profile')
    }
  }

  const onChangeHandler = (e) =>{
    const name = e.target.name
    const value = e.target.value

    setFormData(data=>({...data,[name]:value}))
  }
  
  const onSubitHandler = async(e) =>{
    e.preventDefault()
    try {
      let orderItems = []

      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item]>0){
            const itemInfo = structuredClone(products.find(product=>product._id === items))
            itemInfo.size = item
            itemInfo.quantity = cartItems[items][item]
            orderItems.push(itemInfo)
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }

      switch (method) {
        // COD Method
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}})
          if(response.data.success){
            setCartItems({})
            // Navigate to SuccessOrder page with order data
            navigate('/success-order', {
              state: {
                orderData: {
                  items: orderItems,
                  amount: orderData.amount,
                  address: formData,
                  paymentMethod: 'cod',
                  status: 'Order Placed',
                  date: Date.now()
                }
              }
            })
            toast.success(response.data.message)
          }else{
            toast.error(response.data.message)
          }
        break;

        case 'stripe':
          const stripeResponse = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}})
          if(stripeResponse.data.success){
            const {session_url} = stripeResponse.data
            setCartItems({})
            // Stripe will redirect to /verify page, which then redirects to /success-order
            window.location.replace(session_url) 
          }else{
            toast.error(stripeResponse.data.message)
          }
        break;

        default:
          break;  
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubitHandler}  className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-400'>
      {/*Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='flex items-center justify-between'>
          <div className='text-base md:text-xl lg:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
          </div>
          {token && (
            <button
              type="button"
              onClick={saveToProfile}
              className='text-xs text-gray-600 hover:text-gray-800 underline'
            >
              Save to Profile
            </button>
          )}
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='First name'/>
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='Last name'/>
        </div>
      <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="email" placeholder='Email address'/>
      <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='Street'/>
      <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='City'/>
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='State'/>
          
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none no-spinner' type="number" placeholder='Zipcode'/>
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none' type="text" placeholder='Country'/>        
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none no-spinner' type="number" placeholder='Phone'/>     
      </div>
        {/* Right Side*/}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartPortal />
        </div>
        <div className='text-base md:text-xl lg:text-2xl my-3'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/*Payment Method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-200 rounded-full ${method === 'stripe' ? 'bg-green-400': ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-200 rounded-full ${method === 'cod' ? 'bg-green-400': ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type="submit" className='bg-black active:bg-gray-700
text-white px-16 py-3 text-sm cursor-pointer'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder