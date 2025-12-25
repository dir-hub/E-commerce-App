import reviewModel from '../models/reviewModel.js'
import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'

// Helper function to check if user has purchased the product
const hasUserPurchasedProduct = async (userId, productId) => {
    try {
        // Convert userId to string for comparison (order model stores userId as String)
        const userIdString = userId.toString()
        
        // Find all orders for this user
        const orders = await orderModel.find({ userId: userIdString })
        
        // Check if any order contains this product
        for (const order of orders) {
            if (order.items && Array.isArray(order.items)) {
                const hasProduct = order.items.some(item => {
                    // Check if item has _id matching productId (handle both string and ObjectId)
                    if (item._id) {
                        return item._id.toString() === productId.toString()
                    }
                    return false
                })
                if (hasProduct) {
                    return true
                }
            }
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

// POST /api/review/add - Add or update a review
const addReview = async (req, res) => {
    try {
        const { userId } = req.body
        const { productId, rating, comment } = req.body

        if (!productId || !rating || !comment) {
            return res.json({ success: false, message: 'All fields are required' })
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 and 5' })
        }

        // Check if user has purchased this product
        const hasPurchased = await hasUserPurchasedProduct(userId, productId)
        if (!hasPurchased) {
            return res.json({ 
                success: false, 
                message: 'You must purchase this product before you can review it' 
            })
        }

        // Check if user already reviewed this product
        const existingReview = await reviewModel.findOne({ productId, userId })

        if (existingReview) {
            // Update existing review
            existingReview.rating = rating
            existingReview.comment = comment
            existingReview.date = new Date()
            await existingReview.save()
            return res.json({ success: true, message: 'Review updated successfully', review: existingReview })
        } else {
            // Create new review
            const newReview = new reviewModel({
                productId,
                userId,
                rating,
                comment
            })
            await newReview.save()
            return res.json({ success: true, message: 'Review added successfully', review: newReview })
        }
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return res.json({ success: false, message: 'You have already reviewed this product' })
        }
        res.json({ success: false, message: error.message })
    }
}

// GET /api/review/get/:productId - Get all reviews for a product
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params

        if (!productId) {
            return res.json({ success: false, message: 'Product ID is required' })
        }

        // Get all reviews for the product with user information
        const reviews = await reviewModel.find({ productId })
            .populate('userId', 'name email')
            .sort({ date: -1 })

        // Calculate average rating and total count
        const totalReviews = reviews.length
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
            : 0

        res.json({
            success: true,
            reviews,
            averageRating: parseFloat(averageRating),
            totalReviews
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/review/user/:productId - Get user's review for a product (if exists)
const getUserReview = async (req, res) => {
    try {
        const { userId } = req.body
        const { productId } = req.params

        if (!productId) {
            return res.json({ success: false, message: 'Product ID is required' })
        }

        const review = await reviewModel.findOne({ productId, userId })
            .populate('userId', 'name email')

        res.json({
            success: true,
            review: review || null
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/review/check-purchase/:productId - Check if user has purchased the product
const checkPurchase = async (req, res) => {
    try {
        const { userId } = req.body
        const { productId } = req.params

        if (!productId) {
            return res.json({ success: false, message: 'Product ID is required' })
        }

        const hasPurchased = await hasUserPurchasedProduct(userId, productId)

        res.json({
            success: true,
            hasPurchased
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addReview, getReviews, getUserReview, checkPurchase }

