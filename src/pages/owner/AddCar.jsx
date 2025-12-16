import React, { useState, useEffect } from "react";
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
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;

    // Basic Validation
    if (images.length === 0) {
      return toast.error("Please upload at least one image");
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      // CHANGED: Append each file with the same key 'images'
      // This allows multer.array('images') on the backend to pick them up
      images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
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
        });
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
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-2xl"
      >
        {/* Car Images Upload */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            Upload Car Images (Select Multiple)
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
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            value={car.location}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          >
            <option value="">Select Location</option>
            <option value="Airport">Airport</option>
            <option value="City Center">City Center</option>
            <option value="Train Station">Train Station</option>
            {/* Add your dynamic cities here if available */}
          </select>
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
              List Your Car
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
//           <select onChange={e => setCar({ ...car, location: e.target.value })} value={car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
//             <option value="">Select Location</option>
//             <option value="Airport">Airport</option>
//             <option value="City Center">City Center</option>
//             <option value="Train Station">Train Station</option>
//             {/* Add your dynamic cities here if available */}
//           </select>
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
