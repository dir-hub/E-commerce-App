import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'
import { backendUrl, currency } from '../App'
import Loading from '../components/Loading'


const List = ({token}) => {

  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchList = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
      setList(response.data.products)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchList()
  }, [])
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {
        id,
      },{headers:{token}})
      if (response.data.success) {
        toast.success(response.data.message)
       await fetchList()
      }else{
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return (
    <>
      {isLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50'>
          <Loading />
        </div>
      ) : (
        <>
          <p className='mb-2'>All Products</p>
          <div className='flex flex-col gap-2'>

            <div className='hidden md:grid grid-cols-[3fr_6fr_3fr_3fr_1fr] items-center py-1 px-2 border border-gray-200 bg-gray-100 text-sm'>
              <b>Images</b>
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
              <b className='text-center'>Action</b>
            </div>

            {list.map((item, index) => (
              <div className='grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1.5fr_3.2fr_1.3fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-200 b text-sm' key={index}>
                <img className='w-12' src={item.image[0]} alt="" />
                <div className='flex flex-col'>
                  <p>{item.name}</p>
                  <p className='md:hidden text-xs text-gray-600 '>{currency}{item.price}</p>
                </div>
                <div className='flex items-center justify-end md:justify-start'>
                  <p className='md:hidden mr-2'>{item.category}</p>
                  <p onClick={()=>removeProduct(item._id)} className='mx-4 md:hidden cursor-pointer text-lg hover:text-red-500'>X</p>
                  <p className='hidden md:block'>{item.category}</p>
                </div>
                <p className='hidden md:block '>{currency}{item.price}</p>
                <p onClick={()=>removeProduct(item._id)} className='hidden md:block md:ml-9 lg:ml-10 md:text-center cursor-pointer text-lg hover:text-red-500'>X</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default List