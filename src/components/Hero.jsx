import React, { useState, useEffect, useRef } from "react";
import { cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { MapPin, Search, Calendar, Car } from "lucide-react";

// Video sources for background - add more videos here
const heroVideos = [
  assets.video1,
  assets.video2,
  assets.video3,
];

const TRANSITION_DURATION = 8000; // 8 seconds per video

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef(null);
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate, locations } =
    useAppContext();

  // Video transition effect
  useEffect(() => {
    if (heroVideos.length <= 1) return;

    const transitionInterval = setInterval(() => {
      setIsTransitioning(true);
      
    
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
        setNextVideoIndex((prev) => (prev + 1) % heroVideos.length);
        setIsTransitioning(false);
      }, 1000); // Match this with CSS transition duration
    }, TRANSITION_DURATION);

    return () => clearInterval(transitionInterval);
  }, []);


  useEffect(() => {
    if (nextVideoRef.current) {
      nextVideoRef.current.load();
    }
  }, [nextVideoIndex]);


  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsSticky(heroBottom < 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}${selectedLocation ? `&location=${selectedLocation}` : ''}`
    );
  };

  const handleLocationClick = (locationName) => {
    setSelectedLocation(locationName);
    navigate(`/cars?location=${encodeURIComponent(locationName)}`);
  };


  const SearchForm = ({ isCompact = false }) => (
    <form
      onSubmit={handleSearch}
      className={`flex items-center bg-white rounded-full shadow-lg border border-gray-200 ${
        isCompact 
          ? "p-2 gap-2" 
          : "p-2 md:p-3 gap-1 md:gap-2 w-full max-w-3xl"
      }`}
    >
  
      <div className={`flex items-center gap-2 px-4 py-2 border-r border-gray-200 ${isCompact ? "hidden md:flex" : ""}`}>
        <MapPin size={18} className="text-gray-400" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium">Where</span>
          <select
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="outline-none text-sm font-medium bg-transparent cursor-pointer min-w-[120px]"
          >
            <option value="">Select location</option>
            {cityList.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* From Date */}
      <div className={`flex items-center gap-2 px-4 py-2 border-r border-gray-200 ${isCompact ? "hidden md:flex" : ""}`}>
        <Calendar size={18} className="text-gray-400" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium">From</span>
          <input
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="text-sm font-medium outline-none bg-transparent"
            required
          />
        </div>
      </div>

      {/* Until Date */}
      <div className={`flex items-center gap-2 px-4 py-2 ${isCompact ? "hidden md:flex" : ""}`}>
        <Calendar size={18} className="text-gray-400" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium">Until</span>
          <input
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            type="date"
            className="text-sm font-medium outline-none bg-transparent"
            required
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="flex items-center justify-center bg-primary hover:bg-primary-dull text-white p-3 rounded-full ml-auto transition-all"
      >
        <Search size={20} />
      </button>
    </form>
  );

  return (
    <>
      {/* Sticky Search Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 ${
          isSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl  mx-auto px-4 py-3 flex items-center justify-between gap-4">
      
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img src={assets.logo} alt="Logo" className="h-8 w-auto" />
          </a>
          <SearchForm isCompact />
        </div>
      </div>


      <div ref={heroRef} className="relative min-h-[70vh] overflow-hidden">
        
        <div className="absolute inset-0">
          {/* Current Video */}
          <video
            ref={currentVideoRef}
            key={`video-${currentVideoIndex}`}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            poster="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
          >
            <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
          </video>

          {/* Next Video (preloaded, becomes visible during transition) */}
          <video
            ref={nextVideoRef}
            key={`video-next-${nextVideoIndex}`}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isTransitioning ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={heroVideos[nextVideoIndex]} type="video/mp4" />
          </video>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

          {/* Video Indicator Dots */}
          {heroVideos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentVideoIndex(index);
                    setNextVideoIndex((index + 1) % heroVideos.length);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentVideoIndex === index
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Switch to video ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 italic">
              Skip the rental car counter
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Rent cars from local hosts in <span className="text-primary font-semibold">Goa</span> 🌴
            </p>
          </motion.div>

          {/* Main Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <SearchForm />
          </motion.div>

          {/* Quick Location Pills */}
          {locations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 flex-wrap justify-center mt-8"
            >
              <button
                onClick={() => {
                  setSelectedLocation("");
                  navigate("/cars");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLocation === ""
                    ? "bg-white text-gray-800"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Car size={16} />
                All
              </button>
              {locations.slice(0, 4).map((loc) => (
                <button
                  key={loc._id}
                  onClick={() => handleLocationClick(loc.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedLocation === loc.name
                      ? "bg-white text-gray-800"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <MapPin size={14} />
                  {loc.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;
