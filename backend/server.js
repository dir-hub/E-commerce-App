import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudnary.js'

import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'

// App config
const app = express()


connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)

app.get('/', (req, res) => {
  res.send('API Working 🚀')
})


export default app
