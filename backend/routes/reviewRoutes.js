import express from 'express'
import { addReview, getReviews, getUserReview, checkPurchase } from '../controllers/reviewController.js'
import authUser from '../middleware/auth.js'

const reviewRouter = express.Router()

// Add or update review (requires authentication)
reviewRouter.post('/add', authUser, addReview)

// Get all reviews for a product (public)
reviewRouter.get('/get/:productId', getReviews)

// Get user's review for a product (requires authentication)
reviewRouter.post('/user/:productId', authUser, getUserReview)

// Check if user has purchased the product (requires authentication)
reviewRouter.post('/check-purchase/:productId', authUser, checkPurchase)

export default reviewRouter

