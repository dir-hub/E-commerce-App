import React from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const Add = ({token}) => {

    const [image1, setImage1] = React.useState(false)
    const [image2, setImage2] = React.useState(false)
    const [image3, setImage3] = React.useState(false)    
    const [image4, setImage4] = React.useState(false)

    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [category, setCategory] = React.useState('Men')
    const [subCategory, setSubCategory] = React.useState('Topwear')
    const [price, setPrice] = React.useState('')
    const [size, setSize] = React.useState([])
    const [bestseller, setBestseller] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()

        setIsLoading(true)

        // recommeding giving at least one image
    if(!image1 && !image2 && !image3 && !image4) {
        toast.error('Please upload at least one image')
        setIsLoading(false)
        return
    }
    
    // Validation for size
    if(size.length === 0) {
        toast.error('Please select at least one size')
        setIsLoading(false)
        return
    }
    
    // Validation for price
    if(!price || parseFloat(price) <= 0) {
        toast.error('Price must be greater than 0')
        setIsLoading(false)
        return
    }
        
        try {
            const formData = new FormData()

            formData.append('name', name)
            formData.append('description', description)
            formData.append('category', category)
            formData.append('subCategory', subCategory)
            formData.append('price', price)
            // ensure we never send undefined; backend may JSON.parse this
            formData.append('size', JSON.stringify(Array.isArray(size) ? size : []))
            formData.append('bestseller', bestseller)

            image1 && formData.append('image1', image1)
            image2 && formData.append('image2', image2)
            image3 && formData.append('image3', image3)
            image4 && formData.append('image4', image4)

            

            const response = await axios.post(
                backendUrl + '/api/product/add',
                formData,
                {
                    // let axios set proper multipart boundaries; just send auth header
                    headers: {
                        token: token,
                    },
                }
            )
            
            if (response.data.success) {
                // Reset form
                toast.success(response.data.message)
                setName('')
                setDescription('')
                setPrice('')
                setSize([])
                setBestseller(false)
                setImage1(false)
                setImage2(false)
                setImage3(false)
                setImage4(false)
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)

        } finally{
            setIsLoading(false)
        }
    }
  return isLoading ? (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50'>
      <Loading />
    </div>
  ) : (
    <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>
        <div>
            <p className='mb-2'>Upload Image</p>

            <div className='flex gap-2'>
                <label htmlFor="image1" className='cursor-pointer'>
                    <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="upload area" />
                    <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden accept=".jpg,.jpeg,.png,image/*"/>
                </label>
                <label htmlFor="image2"  >
                    <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="upload area" />
                    <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden  accept=".jpg,.jpeg,.png,image/*"/>
                </label>
                <label htmlFor="image3"  className='cursor-pointer'>
                    <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="upload area" />
                    <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden  accept=".jpg,.jpeg,.png,image/*"/>
                </label>
                <label htmlFor="image4"  className='cursor-pointer'>
                    <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="upload area" />
                    <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden accept=".jpg,.jpeg,.png,image/*"/>
                </label>

            </div>
        </div>
        <div className='w-full'>
            <p className='mb-2'>Product name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-125 px-3 py-2 outline-none' type="text" placeholder='Type here...' required/>
        </div>
        <div className='w-full'>
            <p className='mb-2'>Product description</p>
            <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-125 px-3 py-2 outline-none' rows="4" placeholder='Enter product description...' required></textarea>

        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
                <p className='mb-2'>Product category</p>
                <select onChange={(e)=>setCategory(e.target.value)} className='w-full px-3 py-2 outline-none' required>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kid">Kid</option>
                </select>
            </div>
            <div>
                <p className='mb-2'>Sub category</p>
                <select onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-3 py-2 outline-none' required>
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                </select>
            </div>
            <div>
                <p className='mb-2'>Product Price</p>
                <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-30' type="Number" placeholder='$100' required/>

            </div>
        </div>
        <div>
            <p className='mb-2'>Product Size</p>
            <div className='flex gap-3'>
                <div onClick={()=>setSize(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev,"S"])}>
                    <p className={`${size.includes("S") ? 'bg-pink-200' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                        S
                    </p>
                </div>

                <div onClick={()=>setSize(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev,"M"])}>
                    <p className={`${size.includes("M") ? 'bg-pink-200' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                        M
                    </p>
                </div>

                <div onClick={()=>setSize(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev,"L"])}>
                    <p className={`${size.includes("L") ? 'bg-pink-200' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                        L
                    </p>
                </div>

                <div onClick={()=>setSize(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev,"XL"])}>
                    <p className={`${size.includes("XL") ? 'bg-pink-200' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                        XL
                    </p>
                </div>

                <div onClick={()=>setSize(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev,"XXL"])}>
                    <p className={`${size.includes("XXL") ? 'bg-pink-200' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                        XXL
                    </p>
                </div>
            </div>
        </div>
        <div className='flex gap-2 mt-2'>
            <input onChange={()=> setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller'/>
            <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type='submit' className='w-28 py-3 mt-4 bg-black text-white active:bg-gray-700 cursor-pointer'>ADD</button>
    </form>
  )
}

export default Add