import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { navigate, backendUrl, token } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadProfile()
  }, [token])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } })
      if (response.data.success) {
        const profile = response.data.profile || {}
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
    } catch (error) {
      console.log(error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await axios.post(backendUrl + '/api/user/profile/update', formData, { headers: { token } })
      if (response.data.success) {
        toast.success('Profile saved successfully!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <p className='text-gray-500'>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-400'>
      <div className='text-base md:text-xl lg:text-2xl my-3'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>
      <p className='text-sm text-gray-600 mb-4'>
        Save your delivery information to speed up future orders. This information will be automatically filled when placing an order.
      </p>
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 w-full sm:max-w-[600px]'>
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='firstName'
            value={formData.firstName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors'
            type="text"
            placeholder='First name'
          />
          <input
            required
            onChange={onChangeHandler}
            name='lastName'
            value={formData.lastName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors'
            type="text"
            placeholder='Last name'
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name='email'
          value={formData.email}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors'
          type="email"
          placeholder='Email address'
        />
        <input
          required
          onChange={onChangeHandler}
          name='street'
          value={formData.street}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors'
          type="text"
          placeholder='Street address'
        />
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='city'
            value={formData.city}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors'
            type="text"
            placeholder='City'
          />
          <input
            required
            onChange={onChangeHandler}
            name='state'
            value={formData.state}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors'
            type="text"
            placeholder='State'
          />
        </div>
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='zipcode'
            value={formData.zipcode}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors no-spinner'
            type="number"
            placeholder='Zipcode'
          />
          <input
            required
            onChange={onChangeHandler}
            name='country'
            value={formData.country}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors'
            type="text"
            placeholder='Country'
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name='phone'
          value={formData.phone}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-600 transition-colors no-spinner'
          type="number"
          placeholder='Phone number'
        />
        <div className='flex gap-3 mt-4'>
          <button
            type="submit"
            disabled={saving}
            className='bg-black active:bg-gray-700 text-white px-8 py-3 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors'
          >
            {saving ? 'Saving...' : 'SAVE PROFILE'}
          </button>
          
        </div>
      </form>
    </div>
  )
}

export default Profile

