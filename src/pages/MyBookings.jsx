import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { CheckCircle, Download, MessageCircle, Car, Calendar, MapPin, CreditCard, Sparkles, Wallet } from 'lucide-react'

const MyBookings = () => {

  const { axios, user, currency, token } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [highlightedBookingId, setHighlightedBookingId] = useState(null)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(null)

  const fetchMyBookings = useCallback(async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios])

  useEffect(()=>{
    user && fetchMyBookings()
  },[user, fetchMyBookings])

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

  // Handle payment for unpaid bookings
  const handlePayNow = async (booking) => {
    setProcessingPayment(booking._id);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setProcessingPayment(null);
        return;
      }

      // Create payment order for existing booking
      const { data } = await axios.post("/api/payment/pay-booking", {
        bookingId: booking._id,
        payFull: true,
      });

      if (!data.success) {
        toast.error(data.message);
        setProcessingPayment(null);
        return;
      }

      // Razorpay options
      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Car Rental Goa",
        description: `Payment for ${booking.car.brand} ${booking.car.model}`,
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
              setShowSuccessBanner(true);
              setHighlightedBookingId(booking._id);
              fetchMyBookings(); // Refresh bookings
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed");
            }
          } catch {
            toast.error("Payment verification failed");
          }
          setProcessingPayment(null);
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          bookingId: booking._id,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(null);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setProcessingPayment(null);
      });
      razorpay.open();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setProcessingPayment(null);
    }
  };

  // Handle success from payment redirect
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment')
    const bookingId = searchParams.get('bookingId')
    
    if (paymentSuccess === 'success' && bookingId) {
      setShowSuccessBanner(true)
      setHighlightedBookingId(bookingId)
      toast.success('🎉 Payment successful! Your booking is confirmed.')
      
      // Clear URL params after showing
      setTimeout(() => {
        setSearchParams({})
      }, 500)
      
      // Hide success banner after 10 seconds
      setTimeout(() => {
        setShowSuccessBanner(false)
      }, 10000)
    }
  }, [searchParams, setSearchParams])

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === activeTab)

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 min-h-screen'>
      
      {/* Payment Success Banner */}
      {showSuccessBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg'
        >
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-10 h-10' />
            </div>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold flex items-center gap-2'>
                <Sparkles className='w-6 h-6' />
                Payment Successful!
              </h2>
              <p className='text-green-100 mt-1'>Your booking has been confirmed. You can download your invoice below.</p>
            </div>
            <button 
              onClick={() => setShowSuccessBanner(false)}
              className='text-white/80 hover:text-white text-2xl'
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>My Bookings</h1>
        <p className='text-gray-500 mt-2'>Manage and track your vehicle rentals</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Total Bookings</p>
          <p className='text-2xl font-bold text-gray-800'>{bookings.length}</p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Confirmed</p>
          <p className='text-2xl font-bold text-green-600'>{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Pending</p>
          <p className='text-2xl font-bold text-yellow-600'>{bookings.filter(b => b.status === 'pending').length}</p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Total Spent</p>
          <p className='text-2xl font-bold text-primary'>{currency}{bookings.reduce((acc, b) => acc + (b.amountPaid || 0), 0)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
        {['all', 'pending', 'confirmed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              activeTab === tab 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab} {tab !== 'all' && `(${bookings.filter(b => tab === 'all' ? true : b.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className='space-y-4'>
        {filteredBookings.length === 0 ? (
          <div className='text-center py-16 bg-gray-50 rounded-xl'>
            <Car className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <p className='text-gray-500'>No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking, index)=>(
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              key={booking._id} 
              className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${
                highlightedBookingId === booking._id 
                  ? 'border-green-400 ring-2 ring-green-200 shadow-green-100' 
                  : 'border-gray-100'
              }`}
            >
              {/* New Booking Badge */}
              {highlightedBookingId === booking._id && (
                <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium px-4 py-2 flex items-center gap-2'>
                  <Sparkles className='w-4 h-4' />
                  New Booking - Payment Confirmed!
                </div>
              )}
              
              <div className='flex flex-col md:flex-row'>
                {/* Car Image */}
                <div className='md:w-48 h-40 md:h-auto shrink-0'>
                  <img 
                    src={booking.car.images && booking.car.images.length > 0 ? booking.car.images[0] : booking.car.image} 
                    alt="" 
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Content */}
                <div className='flex-1 p-5'>
                  <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div>
                      <div className='flex items-center gap-3 mb-2 flex-wrap'>
                        <h3 className='text-lg font-semibold text-gray-800'>{booking.car.brand} {booking.car.model}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        {booking.paymentStatus && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            💳 {booking.paymentStatus}
                          </span>
                        )}
                      </div>
                      <p className='text-gray-500 text-sm'>{booking.car.year} • {booking.car.category}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-primary'>{currency}{booking.price}</p>
                      <p className='text-xs text-gray-400'>Total Price</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100'>
                    <div className='flex items-start gap-2'>
                      <Calendar className='w-4 h-4 text-gray-400 mt-0.5' />
                      <div>
                        <p className='text-xs text-gray-400 mb-1'>Pickup</p>
                        <p className='text-sm font-medium'>{new Date(booking.pickupDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-2'>
                      <Calendar className='w-4 h-4 text-gray-400 mt-0.5' />
                      <div>
                        <p className='text-xs text-gray-400 mb-1'>Return</p>
                        <p className='text-sm font-medium'>{new Date(booking.returnDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-2'>
                      <MapPin className='w-4 h-4 text-gray-400 mt-0.5' />
                      <div>
                        <p className='text-xs text-gray-400 mb-1'>Location</p>
                        <p className='text-sm font-medium'>{booking.car.location}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-2'>
                      <CreditCard className='w-4 h-4 text-gray-400 mt-0.5' />
                      <div>
                        <p className='text-xs text-gray-400 mb-1'>Payment</p>
                        <p className='text-sm font-medium text-green-600'>{currency}{booking.amountPaid || 0} paid</p>
                        {booking.price > (booking.amountPaid || 0) && (
                          <p className='text-xs text-red-500'>{currency}{booking.price - (booking.amountPaid || 0)} due</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Discount Info */}
                  {booking.discountAmount > 0 && (
                    <div className='mt-3 p-2 bg-green-50 rounded-lg'>
                      <p className='text-xs text-green-700'>
                        🎉 You saved {currency}{booking.discountAmount} with coupon!
                        {booking.appliedCoupon && ` (${booking.appliedCoupon.code})`}
                      </p>
                    </div>
                  )}

                  {/* Owner Contact & Actions */}
                  {booking.owner && (
                    <div className='mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4'>
                      <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold'>
                        {booking.owner.name?.charAt(0)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>{booking.owner.name}</p>
                        <p className='text-xs text-gray-500'>{booking.owner.phone}</p>
                      </div>
                      <div className='flex gap-2 flex-wrap'>
                        {/* Pay Now button for unpaid bookings */}
                        {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                          <button 
                            onClick={() => handlePayNow(booking)}
                            disabled={processingPayment === booking._id}
                            className='px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <Wallet className='w-4 h-4' />
                            {processingPayment === booking._id ? 'Processing...' : `Pay ${currency}${booking.price - (booking.amountPaid || 0)}`}
                          </button>
                        )}
                        <a 
                          href={`https://wa.me/${booking.owner.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className='px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2'
                        >
                          <MessageCircle className='w-4 h-4' />
                          WhatsApp
                        </a>
                        {(booking.status === 'confirmed' || booking.paymentStatus === 'paid') && (
                          <a 
                            href={`${import.meta.env.VITE_BASE_URL}/api/bookings/pdf/${booking._id}?token=${token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dull transition-colors flex items-center gap-2'
                          >
                            <Download className='w-4 h-4' />
                            Invoice
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyBookings
