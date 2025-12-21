import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import LocationSection from '../components/LocationSection'

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedSection />
      <LocationSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </>
  )
}

export default Home
