import express from 'express'
import { loginUser,registerUser,adminLogin,getUserProfile,updateUserProfile } from '../controllers/userController.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/login',loginUser)
userRouter.post('/register',registerUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/profile',authUser,getUserProfile)
userRouter.post('/profile/update',authUser,updateUserProfile)

export default userRouter