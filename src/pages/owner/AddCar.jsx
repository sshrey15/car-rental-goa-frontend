import React, { useState, useEffect, useCallback } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency } = useAppContext();

  // CHANGED: State now holds an array of files
  const [images, setImages] = useState([]);

  // Helper to manage preview URLs to avoid memory leaks
  const [previewUrls, setPreviewUrls] = useState([]);

  // State for locations and coupons from database
  const [locations, setLocations] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "", // Changed to string for input, convert if needed
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
    appliedCoupon: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState("");

  // Fetch locations and coupons from database
  const fetchLocations = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/locations/active');
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.log(error);
    }
  }, [axios]);

  const fetchCoupons = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/coupons/active');
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.log(error);
    }
  }, [axios]);

  useEffect(() => {
    fetchLocations();
    fetchCoupons();
  }, [fetchLocations, fetchCoupons]);

  // Cleanup object URLs when images change
  useEffect(() => {
    if (images.length < 1) return;
    const newPreviews = [];
    images.forEach((img) => newPreviews.push(URL.createObjectURL(img)));
    setPreviewUrls(newPreviews);

    // Cleanup function
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Function to add custom location to database
  const addCustomLocation = async () => {
    if (!customLocation.trim()) {
      toast.error("Please enter a location name");
      return;
    }
    
    try {
      const { data } = await axios.post('/api/admin/location/create', {
        name: customLocation.trim()
      });
      
      if (data.success) {
        toast.success("Location added successfully!");
        setCar({ ...car, location: customLocation.trim() });
        setIsCustomLocation(false);
        setCustomLocation("");
        fetchLocations(); // Refresh locations list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;

    // Basic Validation
    if (images.length === 0) {
      return toast.error("Please upload at least one image");
    }

    if (!car.location) {
      return toast.error("Please select a location");
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      images.forEach((image) => {
        formData.append("images", image);
      });

      // Remove empty appliedCoupon before sending
      const carData = { ...car };
      if (!carData.appliedCoupon) {
        delete carData.appliedCoupon;
      }

      formData.append("carData", JSON.stringify(carData));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success("Vehicle added! Waiting for admin approval.");
        setImages([]); // Clear images
        setPreviewUrls([]);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          location: "",
          description: "",
          appliedCoupon: "",
        });
        setIsCustomLocation(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Vehicle"
        subTitle="Fill in details to list a new vehicle for booking."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-2xl"
      >
        {/* Car Images Upload */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            Upload Vehicle Images (Select Multiple)
          </p>
          <div className="flex flex-wrap gap-3">
            {/* Upload Trigger Label */}
            <label
              htmlFor="car-images"
              className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <img
                src={assets.upload_icon}
                alt=""
                className="w-8 h-8 opacity-50"
              />
              <span className="text-xs mt-1">Upload</span>
              <input
                type="file"
                id="car-images"
                multiple // ENABLE MULTIPLE SELECTION
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

            {/* Image Previews */}
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Car Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <input
              type="text"
              placeholder="e.g. BMW"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g. X5"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Car Year, Price, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="2025"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder="100"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
              <option value="Scooter">Scooter</option>
              <option value="Bike">Bike</option>
            </select>
          </div>
        </div>

        {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Transmission</label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Fuel Type</label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select Fuel</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>
            <input
              type="number"
              placeholder="4"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: e.target.value })
              }
            />
          </div>
        </div>

        {/* Car Location */}
        <div className="flex flex-col w-full">
          <label>Location</label>
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === "Other") {
                setCar({ ...car, location: "" });
                setIsCustomLocation(true);
              } else {
                setCar({ ...car, location: val });
                setIsCustomLocation(false);
              }
            }}
            value={isCustomLocation ? "Other" : car.location}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location._id} value={location.name}>
                {location.name}
              </option>
            ))}
            <option value="Other">Other (Add New Location)</option>
          </select>
          {isCustomLocation && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter new location name"
                className="px-3 py-2 border border-borderColor rounded-md outline-none flex-1"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
              <button
                type="button"
                onClick={addCustomLocation}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Coupon Selection */}
        <div className="flex flex-col w-full">
          <label>Apply Coupon (Optional)</label>
          <select
            onChange={(e) => setCar({ ...car, appliedCoupon: e.target.value })}
            value={car.appliedCoupon}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          >
            <option value="">No Coupon</option>
            {coupons.map((coupon) => (
              <option key={coupon._id} value={coupon._id}>
                {coupon.code} - {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `${currency}${coupon.discountValue} off`}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select a coupon to offer discount to customers booking this vehicle
          </p>
        </div>

        {/* Car Description */}
        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            rows={5}
            placeholder="Describe the car..."
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer hover:bg-primary-dull transition-colors">
          {isLoading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <img
                src={assets.tick_icon}
                alt=""
                className="w-4 h-4 brightness-0 invert"
              />
              List Your Vehicle
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCar;

// import React, { useState, useEffect } from 'react'
// import Title from '../../components/owner/Title'
// import { assets } from '../../assets/assets'
// import { useAppContext } from '../../context/AppContext'
// import toast from 'react-hot-toast'

// const AddCar = () => {

//   const { axios, currency } = useAppContext()

//   // CHANGED: State now holds an array of files
//   const [images, setImages] = useState([])

//   // Helper to manage preview URLs to avoid memory leaks
//   const [previewUrls, setPreviewUrls] = useState([])

//   const [car, setCar] = useState({
//     brand: '',
//     model: '',
//     year: '', // Changed to string for input, convert if needed
//     pricePerDay: '',
//     category: '',
//     transmission: '',
//     fuel_type: '',
//     seating_capacity: '',
//     location: '',
//     description: '',
//   })

//   const [isLoading, setIsLoading] = useState(false)
//   const [isCustomLocation, setIsCustomLocation] = useState(false)

//   // Cleanup object URLs when images change
//   useEffect(() => {
//     if (images.length < 1) return;
//     const newPreviews = [];
//     images.forEach(img => newPreviews.push(URL.createObjectURL(img)));
//     setPreviewUrls(newPreviews);

//     // Cleanup function
//     return () => {
//       newPreviews.forEach(url => URL.revokeObjectURL(url));
//     }
//   }, [images])

//   const onSubmitHandler = async (e) => {
//     e.preventDefault()
//     if (isLoading) return null

//     // Basic Validation
//     if (images.length === 0) {
//         return toast.error("Please upload at least one image")
//     }

//     setIsLoading(true)
//     try {
//       const formData = new FormData()

//       // CHANGED: Append each file with the same key 'images'
//       // This allows multer.array('images') on the backend to pick them up
//       images.forEach((image) => {
//         formData.append('images', image)
//       })

//       formData.append('carData', JSON.stringify(car))

//       const { data } = await axios.post('/api/owner/add-car', formData)

//       if (data.success) {
//         toast.success(data.message)
//         setImages([]) // Clear images
//         setPreviewUrls([])
//         setCar({
//           brand: '',
//           model: '',
//           year: '',
//           pricePerDay: '',
//           category: '',
//           transmission: '',
//           fuel_type: '',
//           seating_capacity: '',
//           location: '',
//           description: '',
//         })
//         setIsCustomLocation(false)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Handle file selection
//   const handleImageChange = (e) => {
//       const files = Array.from(e.target.files);
//       setImages(files);
//   }

//   return (
//     <div className='px-4 py-10 md:px-10 flex-1'>

//       <Title title="Add New Car" subTitle="Fill in details to list a new car for booking." />

//       <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-2xl'>

//         {/* Car Images Upload */}
//         <div className='flex flex-col gap-2'>
//             <p className='text-sm text-gray-500'>Upload Car Images (Select Multiple)</p>
//             <div className='flex flex-wrap gap-3'>
//                 {/* Upload Trigger Label */}
//                 <label htmlFor="car-images" className='cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50'>
//                     <img src={assets.upload_icon} alt="" className='w-8 h-8 opacity-50' />
//                     <span className='text-xs mt-1'>Upload</span>
//                     <input
//                         type="file"
//                         id="car-images"
//                         multiple // ENABLE MULTIPLE SELECTION
//                         accept="image/*"
//                         hidden
//                         onChange={handleImageChange}
//                     />
//                 </label>

//                 {/* Image Previews */}
//                 {previewUrls.map((url, index) => (
//                     <div key={index} className='relative w-24 h-24'>
//                         <img
//                             src={url}
//                             alt={`Preview ${index}`}
//                             className='w-full h-full object-cover rounded-lg border border-gray-200'
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>

//         {/* Car Brand & Model */}
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           <div className='flex flex-col w-full'>
//             <label>Brand</label>
//             <input type="text" placeholder="e.g. BMW" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e => setCar({ ...car, brand: e.target.value })} />
//           </div>
//           <div className='flex flex-col w-full'>
//             <label>Model</label>
//             <input type="text" placeholder="e.g. X5" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} />
//           </div>

//         </div>

//         {/* Car Year, Price, Category */}
//         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
//           <div className='flex flex-col w-full'>
//             <label>Year</label>
//             <input type="number" placeholder="2025" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e => setCar({ ...car, year: e.target.value })} />
//           </div>
//           <div className='flex flex-col w-full'>
//             <label>Daily Price ({currency})</label>
//             <input type="number" placeholder="100" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e => setCar({ ...car, pricePerDay: e.target.value })} />
//           </div>
//           <div className='flex flex-col w-full'>
//             <label>Category</label>
//             <select onChange={e => setCar({ ...car, category: e.target.value })} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
//               <option value="">Select Category</option>
//               <option value="Sedan">Sedan</option>
//               <option value="SUV">SUV</option>
//               <option value="Van">Van</option>
//               <option value="Luxury">Luxury</option>
//               <option value="Sports">Sports</option>
//             </select>
//           </div>
//         </div>

//         {/* Car Transmission, Fuel Type, Seating Capacity */}
//         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
//           <div className='flex flex-col w-full'>
//             <label>Transmission</label>
//             <select onChange={e => setCar({ ...car, transmission: e.target.value })} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
//               <option value="">Select Transmission</option>
//               <option value="Automatic">Automatic</option>
//               <option value="Manual">Manual</option>
//             </select>
//           </div>
//           <div className='flex flex-col w-full'>
//             <label>Fuel Type</label>
//             <select onChange={e => setCar({ ...car, fuel_type: e.target.value })} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
//               <option value="">Select Fuel</option>
//               <option value="Petrol">Petrol</option>
//               <option value="Diesel">Diesel</option>
//               <option value="Electric">Electric</option>
//               <option value="Hybrid">Hybrid</option>
//             </select>
//           </div>
//           <div className='flex flex-col w-full'>
//             <label>Seating Capacity</label>
//             <input type="number" placeholder="4" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e => setCar({ ...car, seating_capacity: e.target.value })} />
//           </div>
//         </div>

//         {/* Car Location */}
//         <div className='flex flex-col w-full'>
//           <label>Location</label>
//           <select onChange={e => {
//               const val = e.target.value;
//               if (val === "Other") {
//                 setCar({ ...car, location: "" });
//                 setIsCustomLocation(true);
//               } else {
//                 setCar({ ...car, location: val });
//                 setIsCustomLocation(false);
//               }
//             }} value={isCustomLocation ? "Other" : car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
//             <option value="">Select Location</option>
//             <option value="Airport">Airport</option>
//             <option value="City Center">City Center</option>
//             <option value="Train Station">Train Station</option>
//             <option value="Other">Other (Custom)</option>
//           </select>
//           {isCustomLocation && (
//             <input
//               type="text"
//               placeholder="Enter custom location"
//               className='px-3 py-2 mt-2 border border-borderColor rounded-md outline-none'
//               value={car.location}
//               onChange={e => setCar({ ...car, location: e.target.value })}
//               required
//             />
//           )}
//         </div>

//         {/* Car Description */}
//         <div className='flex flex-col w-full'>
//           <label>Description</label>
//           <textarea rows={5} placeholder="Describe the car..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e => setCar({ ...car, description: e.target.value })}></textarea>
//         </div>

//         <button className='flex items-center gap-2 px-6 py-3 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer hover:bg-primary-dull transition-colors'>
//           {isLoading ? (
//               <span>Uploading...</span>
//           ) : (
//             <>
//                 <img src={assets.tick_icon} alt="" className="w-4 h-4 brightness-0 invert" />
//                 List Your Car
//             </>
//           )}
//         </button>

//       </form>
//     </div>
//   )
// }

// export default AddCar
