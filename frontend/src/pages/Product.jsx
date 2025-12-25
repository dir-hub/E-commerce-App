import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState(null);
  const [size, setSize] = useState('')
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  

  const fetchProductData = () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0])
        return null;
      }
    })
  }

  const handleSizeButton = (item) => {
    setSize(size === item ? '' : item)
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(backendUrl + `/api/review/get/${productId}`)
      if (response.data.success) {
        setReviews(response.data.reviews)
        setAverageRating(response.data.averageRating)
        setTotalReviews(response.data.totalReviews)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUserReview = async () => {
    if (!token) return
    try {
      const response = await axios.post(backendUrl + `/api/review/user/${productId}`, {}, { headers: { token } })
      if (response.data.success && response.data.review) {
        setUserReview(response.data.review)
        setRating(response.data.review.rating)
        setComment(response.data.review.comment)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkPurchaseStatus = async () => {
    if (!token) {
      setHasPurchased(false)
      return
    }
    setCheckingPurchase(true)
    try {
      const response = await axios.post(backendUrl + `/api/review/check-purchase/${productId}`, {}, { headers: { token } })
      if (response.data.success) {
        setHasPurchased(response.data.hasPurchased)
      }
    } catch (error) {
      console.log(error)
      setHasPurchased(false)
    } finally {
      setCheckingPurchase(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('Please login to submit a review')
      return
    }
    if (!hasPurchased) {
      toast.error('You must purchase this product before you can review it')
      return
    }
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/review/add',
        { productId, rating, comment },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        setUserReview(response.data.review)
        fetchReviews()
        setActiveTab('reviews')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<img key={i} src={assets.star_icon} alt="" className="w-3 h-3" />)
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(<img key="half" src={assets.star_dull_icon} alt="" className="w-3 h-3" />)
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(<img key={i} src={assets.star_dull_icon} alt="" className="w-3 h-3" />)
    }
    return stars
  }

  const scrollToSection = (id) => {
    setActiveTab(id);
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
};


  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    if (productId) {
      fetchReviews()
      if (token) {
        fetchUserReview()
        checkPurchaseStatus()
      } else {
        setHasPurchased(false)
      }
    }
  }, [productId, token])
  return productData ? (
    <div className='border-t border-gray-400 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer' alt="" />
              ))
            }

          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>

        </div>
        {/*  - Product Info -*/}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div  onClick={() => scrollToSection('reviews')} className='flex items-center gap-1 mt-2 cursor-pointer hover:underline border-gray-400'>
            {renderStars(averageRating)}
            <p className='pl-2 text-sm text-gray-600 cursor-pointer hover:underline'>
              {averageRating > 0 ? `${averageRating.toFixed(1)}` : 'No ratings'} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </p>
          </div>
          <p className='mt-5 text-xl sm:text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={()=>handleSizeButton(item)} className={`border border-gray-200 py-2 px-4  cursor-pointer
bg-gray-100 ${item === size ? 'border-orange-500' : ''} `} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5 border-gray-200'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
             {/* - Description & Review Section -*/}
             <div className='mt-20'>
              <div className='flex'>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`border-t border-l border-r px-5 py-3 text-sm border-gray-200 cursor-pointer transition-colors ${
                    activeTab === 'description' ? 'bg-gray-50 font-semibold' : ''
                  }`}
                >
                  Description
                </button>
                <button  id="reviews"
                  onClick={() => setActiveTab('reviews')} 
                  className={`border-t border-r px-5 py-3 text-sm border-gray-200 cursor-pointer transition-colors ${
                    activeTab === 'reviews' ? 'bg-gray-50 font-semibold' : ''
                  }`}
                >
                  Reviews ({totalReviews})
                </button>
              </div>
              
              {activeTab === 'description' && (
                <div className='flex flex-col gap-4 border border-gray-200 px-6 py-6 text-sm text-gray-500'>
                  <p>An e-commerce website is a digital platform that enables users to browse, search, and purchase products or services online. It provides a seamless shopping experience by offering features such as product listings, secure payment gateways, user authentication, order management, and customer support—making buying and selling faster, easier, and accessible from anywhere.</p>
                  <p>E-commerce websites typically display products or services along with detailed descriptions, images, pricing, and availability. They allow users to compare items, add products to a shopping cart, and complete purchases through secure and convenient online payment systems.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className='border border-gray-200 px-6 py-6'>
                  {/* Review Form - Only show if user is logged in and has purchased */}
                  {token && (
                    <div className='mb-8 pb-8 border-b border-gray-200'>
                      {checkingPurchase ? (
                        <p className='text-sm text-gray-500'>Checking purchase status...</p>
                      ) : hasPurchased ? (
                        <>
                          <h3 className='text-lg font-semibold mb-4'>{userReview ? 'Update Your Review' : 'Write a Review'}</h3>
                          <form onSubmit={handleSubmitReview} className='flex flex-col gap-4'>
                            <div>
                              <p className='text-sm text-gray-600 mb-2'>Rating *</p>
                              <div className='flex gap-2'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className='focus:outline-none'
                                  >
                                    <img
                                      src={star <= rating ? assets.star_icon : assets.star_dull_icon}
                                      alt=""
                                      className="w-6 h-6 cursor-pointer"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder='Write your review here...'
                                className='w-full border border-gray-300 rounded py-2 px-3 outline-none focus:border-gray-600 resize-none'
                                rows="4"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className='bg-black text-white px-6 py-2 text-sm active:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-fit'
                            >
                              {loading ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className='bg-yellow-50 border border-yellow-200 rounded p-4'>
                          <p className='text-sm text-yellow-800'>
                            <strong>Note:</strong> You must purchase this product before you can submit a review. This helps us maintain authentic and verified reviews.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!token && (
                    <div className='mb-8 pb-8 border-b border-gray-200'>
                      <div className='bg-gray-50 border border-gray-200 rounded p-4'>
                        <p className='text-sm text-gray-600'>
                          Please <a href="/login" className='text-black underline font-semibold'>login</a> to write a review. Only verified purchasers can submit reviews.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div>
                    <h3 className='text-lg font-semibold mb-4'>Customer Reviews</h3>
                    {reviews.length === 0 ? (
                      <p className='text-gray-500 text-sm'>No reviews yet. Be the first to review this product!</p>
                    ) : (
                      <div className='flex flex-col gap-6'>
                        {reviews.map((review) => (
                          <div key={review._id} className='border-b border-gray-200 pb-4 last:border-0'>
                            <div className='flex items-center gap-3 mb-2'>
                              <div className='flex items-center gap-1'>
                                {renderStars(review.rating)}
                              </div>
                              <p className='text-sm font-semibold'>{review.userId?.name || 'Anonymous'}</p>
                              <p className='text-xs text-gray-500'>
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <p className='text-sm text-gray-700'>{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
             </div>

             {/*display related products */}
             <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id}/>
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product