import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t border-gray-400'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Forever was born out of a passion for innovation and a desire to revolutionize the way people experience quality, trust, and value.
            From the very beginning, our mission has been to create products that blend cutting-edge technology with thoughtful design,
            delivering solutions that stand the test of time. We believe in pushing boundaries, embracing change, and building a future
            where excellence is not an option—but a standard.
          </p>

          <p>
            Since our inception, we've worked tirelessly to curate a diverse selection of products that meet the highest standards of quality and reliability.
            Every item we offer is carefully chosen to ensure it delivers exceptional performance, lasting value, and a seamless experience for our customers.
            Our commitment to excellence drives us to continuously evolve, adapt, and exceed expectations in everything we do.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>
            Our mission at Forever is to empower customers with choice, convenience, and confidence in every decision they make.
            We strive to create a seamless experience by offering high-quality products, transparent processes, and reliable service.
            By putting our customers at the center of everything we do, we aim to build lasting relationships based on trust and satisfaction.
          </p>

        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border-t border-l border-r md:border-r-0 md:border-b border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>
            We meticulously select and vet each product to ensure it meets our stringent standards for quality, performance, and durability.
            
          </p>

        </div>
        <div className='border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>
            With our user-friendly interface and hassle-free ordering process, shopping becomes a seamless and enjoyable experience.
            
          </p>


        </div>
        <div className='border-b border-l border-r md:border-l-0 md:border-t md:border-b border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>
            Our team of dedicated professionals is here to assist you every step of the way, ensuring your questions are answered and your concerns are resolved promptly.
            
          </p>
 
        </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default About