import {v2 as cloudinary} from 'cloudinary'
import productModel from "../models/productModel.js";

const addProduct = async (req,res)=>{
    try {
        const {name,description, price, category, subCategory, sizes, size, bestseller} = req.body

        console.log('Files received:', req.files)
        console.log('Request body:', req.body)

        const image1 = req.files?.image1 && req.files.image1[0]
        const image2 = req.files?.image2 && req.files.image2[0]
        const image3 = req.files?.image3 && req.files.image3[0]
        const image4 = req.files?.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined && item !== null)

       

        let imagesUrl = []
        if (images.length > 0) {
            imagesUrl = await Promise.all(images.map(async (item)=>{
                // Use buffer for memory storage (Vercel serverless compatible)
                const uploadOptions = {
                    resource_type: 'image',
                    folder: 'forever-products' // Optional: organize images in Cloudinary
                }
                
                // Upload from buffer instead of file path
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        uploadOptions,
                        (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        }
                    ).end(item.buffer)
                })
                
                return result.secure_url
            }))
        }

       

        const productData = {
            name,
            description,
            price: Number(price),
            image: imagesUrl, // Changed from 'images' to 'image' to match model schema
            category,
            subCategory,
            // support both 'sizes' and legacy 'size' from the frontend
            sizes: JSON.parse(sizes || size || '[]'),
            bestseller: bestseller ? true : false,           
            date: Date.now()
        }

        

        const product = new productModel(productData)
        await product.save()
        
        res.json({success:true,message:'Product added successfully'})        
    } catch (error) {
        console.log('Error in addProduct:', error)
        res.json({success:false,message:error.message})
    }
}

const listProducts = async (req,res)=>{
    try {
        const products = await productModel.find({})
        res.json({success:true, products})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})       
    }
}

const removeProduct = async (req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:'Product removed successfully'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const singleProduct = async (req,res)=>{
    try {
        const {productId} = req.body
        
        const product = await productModel.findById(productId)
        
        res.json({success:true, product})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})        
    }
}

export {addProduct,listProducts,removeProduct,singleProduct}