import multer from 'multer'

// Use memory storage for Vercel serverless compatibility
// Files are stored in memory and uploaded directly to Cloudinary
const storage = multer.memoryStorage()

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
})

export default upload