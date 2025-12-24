import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import{ motion} from "motion/react";

const CarDetails = () => {
  const { id } = useParams();

  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user, setShowLogin } =
    useAppContext();

  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  // New state to handle the currently displayed image in the gallery
  const [activeImage, setActiveImage] = useState(null);
  const [payPartial, setPayPartial] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currency = import.meta.env.VITE_CURRENCY;

  // Valid promo codes
  const PROMO_CODES = {
    'GOA10': 10,
    'FIRST20': 20,
    'SUMMER15': 15,
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoApplied(true);
      toast.success(`Promo code applied! ${PROMO_CODES[code]}% off`);
    } else {
      toast.error("Invalid promo code");
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    
    if (returned <= picked) {
      toast.error("Return date must be after pickup date");
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Create payment order
      const { data } = await axios.post("/api/payment/create-order", {
        car: id,
        pickupDate,
        returnDate,
        couponCode: promoApplied ? promoCode : null,
        payPartial,
      });

      if (!data.success) {
        toast.error(data.message);
        setIsProcessing(false);
        return;
      }

      // Razorpay options
      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Car Rental Goa",
        description: `Booking for ${car.brand} ${car.model}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: data.bookingId,
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              // Redirect to My Bookings with success params
              navigate(`/my-bookings?payment=success&bookingId=${data.bookingId}`);
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed");
              navigate("/my-bookings");
            }
          } catch {
            toast.error("Payment verification failed");
            navigate("/my-bookings");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          carId: id,
          pickupDate,
          returnDate,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (cars.length > 0) {
      const foundCar = cars.find((car) => car._id === id);
      if (foundCar) {
        setCar(foundCar);
        // Set initial active image (handling both Array and String legacy data)
        const initialImage =
          foundCar.images && foundCar.images.length > 0
            ? foundCar.images[0]
            : foundCar.image;
        setActiveImage(initialImage);
      }
    }
  }, [cars, id]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car Image & Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          {/* --- MAIN IMAGE --- */}
          <motion.img
            key={activeImage} // Key helps animation trigger on change
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={activeImage}
            alt="Car Main"
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-4 shadow-md bg-gray-100"
          />

          {/* --- THUMBNAIL GALLERY --- */}
          {car.images && car.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
              {car.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg cursor-pointer border-2 transition-all
                        ${activeImage === img ? "border-primary scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
                />
              ))}
            </div>
          )}

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </div>
            <hr className="border-borderColor my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={icon} alt="" className="h-5 mb-2" />
                  {text}
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-24 rounded-xl p-6 space-y-6 text-gray-500 bg-white border border-gray-100"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}
            {car.pricePerDay}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>

          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date" className="font-medium">
              Pickup Date
            </label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg outline-none focus:border-primary"
              required
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date" className="font-medium">
              Return Date
            </label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg outline-none focus:border-primary"
              required
              id="return-date"
            />
          </div>

          {/* Promo Code */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Promo Code</label>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                type="text"
                placeholder="Enter promo code"
                className="border border-borderColor px-3 py-2 rounded-lg outline-none focus:border-primary flex-1"
                disabled={promoApplied}
              />
              <button
                type="button"
                onClick={applyPromoCode}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  promoApplied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                disabled={promoApplied}
              >
                {promoApplied ? '✓ Applied' : 'Apply'}
              </button>
            </div>
            {promoApplied && (
              <p className="text-xs text-green-600">🎉 {discount}% discount applied!</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="pay-partial" 
              checked={payPartial} 
              onChange={(e) => setPayPartial(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="pay-partial" className="text-sm font-medium text-gray-700">
              Pay 50% Advance Now
            </label>
          </div>

          <button 
            disabled={isProcessing}
            className={`w-full py-3 font-medium text-white rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary-dull'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              payPartial ? "Pay 50% & Book" : "Pay Full & Book"
            )}
          </button>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              📍 <strong>Note:</strong> Pickup & return time will be coordinated after booking confirmation.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            <p className="font-medium text-sm text-gray-800">Cancellation Policy</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Free cancellation up to 24 hours before pickup</li>
              <li>• 50% refund for cancellation within 24 hours</li>
              <li>• No refund for no-show</li>
            </ul>
          </div>

          {/* Payment & Refund Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
            <p className="font-medium text-sm text-gray-800">Payment & Refund</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Pay online or cash on pickup</li>
              <li>• Refunds processed within 5-7 business days</li>
              <li>• Security deposit may be required</li>
            </ul>
          </div>

          <p className="text-center text-sm text-gray-400">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
