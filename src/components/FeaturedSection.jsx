import React from 'react'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import { Star, ArrowRight, TrendingUp } from 'lucide-react'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const {cars} = useAppContext()

  return (
    <div className='bg-white'>
      {/* Inspired by recent searches section */}
    

      {/* Featured Vehicles Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='py-12 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50'
      >
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>
            Featured Vehicles
          </h2>
          <button 
            onClick={() => {
              navigate('/cars')
              scrollTo(0, 0)
            }}
            className='flex items-center gap-1 text-primary hover:underline font-medium'
          >
            View all <ArrowRight size={18} />
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cars.slice(0, 6).map((car, index) => (
            <motion.div 
              key={car._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>

        <div className='flex justify-center mt-10'>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onClick={() => {
              navigate('/cars')
              scrollTo(0, 0)
            }}
            className='flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-full font-medium transition-all'
          >
            Explore all vehicles <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default FeaturedSection
