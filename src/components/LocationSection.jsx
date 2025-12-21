import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const LocationSection = () => {
  const navigate = useNavigate()

  // Temporary data for demonstration
  const locations = [
    {
      id: 'dabolim',
      name: 'Dabolim Airport',
      subtitle: 'South Goa International Airport',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
      vehicleCount: 24,
      vehicles: [
        { name: 'Mahindra Thar', price: 3500, image: assets.car_image1 || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400' },
        { name: 'Maruti Swift', price: 1500, image: assets.car_image2 || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400' },
        { name: 'Honda Activa', price: 500, image: assets.bike || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400' },
        { name: 'Royal Enfield', price: 1200, image: assets.bike || 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=400' },
      ]
    },
    {
      id: 'mopa',
      name: 'Mopa Airport',
      subtitle: 'North Goa International Airport',
      image: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800',
      vehicleCount: 18,
      vehicles: [
        { name: 'Toyota Fortuner', price: 5000, image: assets.car_image3 || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400' },
        { name: 'Hyundai Creta', price: 2500, image: assets.car_image4 || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400' },
        { name: 'Suzuki Access', price: 450, image: assets.bike || 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=400' },
        { name: 'KTM Duke', price: 1500, image: assets.bike || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400' },
      ]
    },
    {
      id: 'madgaon',
      name: 'Madgaon Railway Station',
      subtitle: 'Major Rail Hub in South Goa',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
      vehicleCount: 15,
      vehicles: [
        { name: 'Maruti Ertiga', price: 2200, image: assets.car_image1 || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400' },
        { name: 'Tata Nexon', price: 2000, image: assets.car_image2 || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400' },
        { name: 'TVS Jupiter', price: 400, image: assets.bike || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400' },
      ]
    },
    {
      id: 'panjim',
      name: 'Panjim City Center',
      subtitle: 'Capital City of Goa',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
      vehicleCount: 32,
      vehicles: [
        { name: 'Mahindra XUV700', price: 4500, image: assets.car_image3 || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400' },
        { name: 'Honda City', price: 2800, image: assets.car_image4 || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400' },
        { name: 'Vespa', price: 700, image: assets.bike || 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=400' },
        { name: 'Bajaj Pulsar', price: 800, image: assets.bike || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400' },
      ]
    },
  ]

  const currency = import.meta.env.VITE_CURRENCY

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16'>
      {/* Section Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-3'>
          Browse by Location
        </h2>
        <p className='text-gray-500 max-w-2xl mx-auto'>
          Find vehicles near airports, railway stations, and popular destinations in Goa
        </p>
      </div>

      {/* Location Cards */}
      <div className='space-y-12'>
        {locations.map((location, index) => (
          <div key={location.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-stretch`}>
            {/* Location Info Card */}
            <div className='md:w-1/3 relative rounded-2xl overflow-hidden group cursor-pointer' onClick={() => navigate(`/cars?location=${location.name}`)}>
              <img 
                src={location.image} 
                alt={location.name}
                className='w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                <h3 className='text-2xl font-bold mb-1'>{location.name}</h3>
                <p className='text-white/80 text-sm mb-3'>{location.subtitle}</p>
                <div className='flex items-center gap-2'>
                  <span className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm'>
                    {location.vehicleCount}+ vehicles
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicles Grid */}
            <div className='md:w-2/3'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-lg font-semibold text-gray-800'>
                  Popular near {location.name.split(' ')[0]}
                </h4>
                <button 
                  onClick={() => navigate(`/cars?location=${location.name}`)}
                  className='text-primary text-sm font-medium hover:underline'
                >
                  View all →
                </button>
              </div>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {location.vehicles.map((vehicle, vIndex) => (
                  <div 
                    key={vIndex}
                    className='bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group'
                    onClick={() => navigate('/cars')}
                  >
                    <div className='h-28 overflow-hidden bg-gray-100'>
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <div className='p-3'>
                      <p className='font-medium text-gray-800 text-sm truncate'>{vehicle.name}</p>
                      <p className='text-primary font-semibold text-sm mt-1'>
                        {currency}{vehicle.price}<span className='text-gray-400 font-normal text-xs'>/day</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Search by Location */}
      <div className='mt-16 bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-8'>
        <div className='text-center mb-6'>
          <h3 className='text-xl font-bold text-gray-800 mb-2'>Quick Pickup Locations</h3>
          <p className='text-gray-500 text-sm'>Click on a location to see available vehicles</p>
        </div>
        <div className='flex flex-wrap justify-center gap-3'>
          {['Dabolim Airport', 'Mopa Airport', 'Panjim KTC', 'Margao KTC', 'Calangute Beach', 'Baga Beach', 'Anjuna', 'Vasco'].map((loc) => (
            <button 
              key={loc}
              onClick={() => navigate(`/cars?location=${loc}`)}
              className='px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-primary hover:text-white transition-colors shadow-sm'
            >
              📍 {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationSection
