import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

import { Plane, Bus, Train, MapPin } from "lucide-react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [activeLocationType, setActiveLocationType] = useState("airport"); // Default state

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  // Definition for your pills
  const locationCategories = [
    { id: "airport", label: "Airport", icon: Plane },
    { id: "bus_stand", label: "Bus Stand", icon: Bus },
    { id: "train_station", label: "Station", icon: Train },
    { id: "city_center", label: "City Center", icon: MapPin },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Included locationType in the search params
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}&locationType=${activeLocationType}`,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center gap-10 bg-light text-center px-4"
    >
      {" "}
      {/* Reduced gap, added padding */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold"
      >
        Luxury cars on Rent
      </motion.h1>
      {/* --- NEW: Location Type Pills --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 w-full justify-center"
      >
        {locationCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveLocationType(cat.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 border shadow-sm whitespace-nowrap
                        ${
                          activeLocationType === cat.id
                            ? "bg-primary text-white border-primary scale-105 shadow-md"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
          >
            <cat.icon size={18} />

            <span className="font-medium text-sm">{cat.label}</span>
          </button>
        ))}
      </motion.div>
      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-xl md:rounded-full w-full max-w-4xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full md:w-auto md:ml-6">
          <div className="flex flex-col items-start gap-2 w-full md:w-auto">
            <div className="relative w-full">
              <select
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full md:w-40 outline-none font-medium bg-transparent cursor-pointer appearance-none z-10 relative"
              >
                <option value="">Pickup Location</option>
                {cityList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {/* Optional: Add a custom chevron icon here if appearance-none is used */}
            </div>
            <p className="text-sm text-gray-500 text-left w-full">
              {pickupLocation ? pickupLocation : "Select City"}
            </p>
          </div>

          {/* Divider for Desktop */}
          <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

          <div className="flex flex-col items-start gap-2 w-full md:w-auto">
            <label htmlFor="pickup-date" className="font-medium">
              Pick-up Date
            </label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500 outline-none w-full bg-transparent"
              required
            />
          </div>

          {/* Divider for Desktop */}
          <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

          <div className="flex flex-col items-start gap-2 w-full md:w-auto">
            <label htmlFor="return-date" className="font-medium">
              Return Date
            </label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              className="text-sm text-gray-500 outline-none w-full bg-transparent"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-8 py-4 mt-6 md:mt-0 w-full md:w-auto bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer shadow-lg"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 brightness-0 invert"
          />
          Search
        </motion.button>
      </motion.form>
      <motion.img
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        src={assets.main_car}
        alt="car"
        className="max-h-74 w-full object-contain"
      />
    </motion.div>
  );
};

export default Hero;
