import React, { useState, useEffect, useRef } from "react";
import { cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { MapPin, Search, Calendar, Car } from "lucide-react";

// Video sources for background
const heroVideos = [
  assets.video1,
  assets.video2,
  assets.video3,
];

const TRANSITION_DURATION = 8000;

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

  // --- Video Transition Logic ---
  useEffect(() => {
    if (heroVideos.length <= 1) return;
    const transitionInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
        setNextVideoIndex((prev) => (prev + 1) % heroVideos.length);
        setIsTransitioning(false);
      }, 1000);
    }, TRANSITION_DURATION);
    return () => clearInterval(transitionInterval);
  }, []);

  useEffect(() => {
    if (nextVideoRef.current) {
      nextVideoRef.current.load();
    }
  }, [nextVideoIndex]);

  // --- Scroll Logic ---
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

  // --- Responsive Search Form Component ---
  const SearchForm = ({ isCompact = false }) => {
    // Styling classes based on Compact (Sticky) vs Full (Hero)
    const containerClasses = isCompact
      ? "flex items-center gap-2 p-1 md:p-2 bg-white rounded-full border border-gray-200"
      : "flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl md:rounded-full shadow-xl border border-gray-200 p-2 md:p-3 w-full max-w-sm md:max-w-4xl mx-auto";

    const dividerClasses = isCompact
      ? "border-r border-gray-200"
      : "border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-200";

    const inputGroupClasses = `flex items-center gap-3 px-4 py-3 md:py-2 ${dividerClasses} flex-1`;

    return (
      <form onSubmit={handleSearch} className={containerClasses}>
        
        {/* Location Input */}
        {/* On mobile sticky: hide inputs, just show button, or show collapsed view */}
        <div className={`${inputGroupClasses} ${isCompact ? "hidden lg:flex" : "flex"}`}>
          <MapPin size={20} className="text-primary shrink-0" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Where</span>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="outline-none text-sm font-semibold text-gray-800 bg-transparent cursor-pointer w-full appearance-none truncate"
            >
              <option value="">Select location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* From Date */}
        <div className={`${inputGroupClasses} ${isCompact ? "hidden lg:flex" : "flex"}`}>
          <Calendar size={20} className="text-primary shrink-0" />
          <div className="flex flex-col w-full">
             <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">From</span>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm font-semibold text-gray-800 outline-none bg-transparent w-full"
              required
            />
          </div>
        </div>

        {/* Until Date */}
        <div className={`${inputGroupClasses} border-b-0 border-r-0 ${isCompact ? "hidden lg:flex" : "flex"}`}>
          <Calendar size={20} className="text-primary shrink-0" />
          <div className="flex flex-col w-full">
             <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Until</span>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              className="text-sm font-semibold text-gray-800 outline-none bg-transparent w-full"
              required
            />
          </div>
        </div>

        {/* Search Button */}
        <div className={`${isCompact ? "w-auto" : "w-full md:w-auto mt-2 md:mt-0"}`}>
          <button
            type="submit"
            className={`flex items-center justify-center bg-primary hover:bg-primary-dull text-white transition-all shadow-md ${
              isCompact 
              ? "p-2 rounded-full" // Sticky button (small)
              : "w-full md:w-auto py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-full text-base font-bold gap-2" // Hero button (large)
            }`}
          >
            <Search size={isCompact ? 18 : 22} />
            {!isCompact && <span className="md:hidden">Search Cars</span>}
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 ${
          isSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img src={assets.logo} alt="Logo" className="h-8 w-auto" />
          </a>
          
          {/* Compact Search (Visible on Scroll) */}
          <div className="flex-1 flex justify-end md:justify-center">
             {/* On mobile, this just shows a search icon button to save space */}
            <SearchForm isCompact /> 
          </div>

          {/* Optional: Add a hamburger menu here for mobile if needed */}
        </div>
      </div>

      <div ref={heroRef} className="relative min-h-[85vh] md:min-h-[70vh] overflow-hidden bg-black">
        
        {/* --- Background Video Section (Unchanged) --- */}
        <div className="absolute inset-0">
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

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>

        {/* --- Main Content --- */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] md:min-h-[70vh] px-4 pt-16 md:pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 italic drop-shadow-lg">
              Skip the rental counter
            </h1>
            <p className="text-base md:text-xl text-white/90 font-medium px-4">
              Rent cars from local hosts in <span className="text-primary font-bold bg-white/10 px-2 py-1 rounded">Goa</span> 🌴
            </p>
          </motion.div>

          {/* Main Search Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full px-2"
          >
            <SearchForm />
          </motion.div>

          {/* Quick Location Pills */}
          {locations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-2 md:gap-3 flex-wrap justify-center mt-8 md:mt-10 px-2"
            >
              <button
                onClick={() => {
                  setSelectedLocation("");
                  navigate("/cars");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-sm ${
                  selectedLocation === ""
                    ? "bg-white text-gray-900 shadow-lg"
                    : "bg-black/30 text-white hover:bg-black/50 border border-white/20"
                }`}
              >
                <Car size={16} />
                All
              </button>
              {locations.slice(0, 4).map((loc) => (
                <button
                  key={loc._id}
                  onClick={() => handleLocationClick(loc.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-sm ${
                    selectedLocation === loc.name
                      ? "bg-white text-gray-900 shadow-lg"
                      : "bg-black/30 text-white hover:bg-black/50 border border-white/20"
                  }`}
                >
                  <MapPin size={14} />
                  {loc.name}
                </button>
              ))}
            </motion.div>
          )}

          {/* Video Indicator Dots (Responsive positioning) */}
          {heroVideos.length > 1 && (
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentVideoIndex(index);
                    setNextVideoIndex((index + 1) % heroVideos.length);
                  }}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-300 shadow-sm ${
                    currentVideoIndex === index
                      ? "bg-white w-6 md:w-8"
                      : "bg-white/40 hover:bg-white/60 w-1.5 md:w-2"
                  }`}
                  aria-label={`Switch to video ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;