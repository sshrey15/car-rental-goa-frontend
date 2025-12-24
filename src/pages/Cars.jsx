import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { MapPin, X } from 'lucide-react'

const Cars = () => {

  // getting search params from url
  const [searchParams, setSearchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const locationFilter = searchParams.get('location')

  const {cars, axios, locations} = useAppContext()

  const [input, setInput] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(locationFilter || '')

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  const applyFilter = async ()=>{
    let filtered = cars.slice();
    
    // Filter by location if selected
    if(selectedLocation){
      filtered = filtered.filter((car) => car.location === selectedLocation)
    }
    
    // Filter by search input
    if(input !== ''){
      filtered = filtered.filter((car)=>{
        return car.brand.toLowerCase().includes(input.toLowerCase())
        || car.model.toLowerCase().includes(input.toLowerCase())  
        || car.category.toLowerCase().includes(input.toLowerCase())  
        || car.transmission.toLowerCase().includes(input.toLowerCase())
      })
    }
    
    setFilteredCars(filtered)
  }

  const searchCarAvailablity = async () =>{
    const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, returnDate})
    if (data.success) {
      let availableCars = data.availableCars;
      
      // Also apply location filter if present
      if(selectedLocation){
        availableCars = availableCars.filter((car) => car.location === selectedLocation)
      }
      
      setFilteredCars(availableCars)
      if(availableCars.length === 0){
        toast('No cars available')
      }
      return null
    }
  }

  // Handle location pill click
  const handleLocationClick = (locationName) => {
    if(selectedLocation === locationName){
      // Deselect if already selected
      setSelectedLocation('')
      searchParams.delete('location')
    } else {
      setSelectedLocation(locationName)
      searchParams.set('location', locationName)
    }
    setSearchParams(searchParams)
  }

  // Clear location filter
  const clearLocationFilter = () => {
    setSelectedLocation('')
    searchParams.delete('location')
    setSearchParams(searchParams)
  }

  useEffect(()=>{
    isSearchData && searchCarAvailablity()
  },[selectedLocation])

  useEffect(()=>{
    cars.length > 0 && !isSearchData && applyFilter()
  },[input, cars, selectedLocation])

  // Update selectedLocation when URL changes
  useEffect(() => {
    setSelectedLocation(locationFilter || '')
  }, [locationFilter])

  return (
    <div>

      <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}

      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Vehicles' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

        {/* Location Pills */}
        {locations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='flex items-center gap-3 flex-wrap justify-center mt-6 max-w-4xl'
          >
            {locations.map((loc) => (
              <button
                key={loc._id}
                onClick={() => handleLocationClick(loc.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border shadow-sm whitespace-nowrap cursor-pointer text-sm
                            ${
                              selectedLocation === loc.name
                                ? "bg-primary text-white border-primary scale-105 shadow-md"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-primary hover:text-primary"
                            }`}
              >
                <MapPin size={14} />
                <span className="font-medium">{loc.name}</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Show active filter */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 text-primary rounded-full'
          >
            <MapPin size={16} />
            <span className='font-medium'>Showing cars in {selectedLocation}</span>
            <button onClick={clearLocationFilter} className='ml-2 hover:bg-primary/20 rounded-full p-1'>
              <X size={16} />
            </button>
          </motion.div>
        )}

        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}

        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

          <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model, or features' className='w-full h-full outline-none text-gray-500'/>

          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}

      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Vehicles{selectedLocation && ` in ${selectedLocation}`}</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index)=> (
            <motion.div key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <CarCard car={car}/>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default Cars
