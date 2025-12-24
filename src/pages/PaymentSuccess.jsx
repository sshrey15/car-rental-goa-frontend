import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { CheckCircle, Download, ArrowRight, Car, Calendar, MapPin, CreditCard, FileText } from 'lucide-react'

const PaymentSuccess = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { axios, user, currency, token } = useAppContext()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchBookingDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/bookings/details/${bookingId}`)
      if (data.success) {
        setBooking(data.booking)
      } else {
        toast.error(data.message)
        navigate('/my-bookings')
      }
    } catch (error) {
      toast.error('Failed to fetch booking details')
      navigate('/my-bookings')
    } finally {
      setLoading(false)
    }
  }, [axios, bookingId, navigate])

  useEffect(() => {
    if (user && bookingId) {
      fetchBookingDetails()
    }
  }, [user, bookingId, fetchBookingDetails])

  const handleDownloadPDF = async () => {
    try {
      // Open PDF in new tab with token in query parameter
      const pdfUrl = `${import.meta.env.VITE_BASE_URL}/api/bookings/pdf/${bookingId}?token=${token}`
      window.open(pdfUrl, '_blank')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Booking not found</p>
          <Link to="/my-bookings" className="text-primary hover:underline">
            Go to My Bookings
          </Link>
        </div>
      </div>
    )
  }

  const days = Math.ceil(
    (new Date(booking.returnDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your booking has been confirmed</p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6"
        >
          {/* Car Image Header */}
          <div className="relative h-48 md:h-64">
            <img
              src={booking.car.images?.[0] || booking.car.image}
              alt={`${booking.car.brand} ${booking.car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold">{booking.car.brand} {booking.car.model}</h2>
              <p className="opacity-90">{booking.car.year} • {booking.car.category}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-primary mb-2" />
                <p className="text-xs text-gray-500">Pickup Date</p>
                <p className="font-semibold">{new Date(booking.pickupDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-primary mb-2" />
                <p className="text-xs text-gray-500">Return Date</p>
                <p className="font-semibold">{new Date(booking.returnDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <MapPin className="w-5 h-5 text-primary mb-2" />
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-semibold">{booking.car.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <Car className="w-5 h-5 text-primary mb-2" />
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-semibold">{days} Day{days > 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Daily Rate</span>
                  <span>{currency}{booking.car.pricePerDay}/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span>{days} day{days > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Original Price</span>
                  <span>{currency}{booking.originalPrice}</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{currency}{booking.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-primary">{currency}{booking.price}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Amount Paid</span>
                  <span>{currency}{booking.amountPaid}</span>
                </div>
                {booking.price > booking.amountPaid && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Due at Pickup</span>
                    <span>{currency}{booking.price - booking.amountPaid}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-3">Transaction Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-mono text-xs">{booking._id}</span>
                </div>
                {booking.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment ID</span>
                    <span className="font-mono text-xs">{booking.razorpayPaymentId}</span>
                  </div>
                )}
                {booking.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="capitalize">{booking.paymentMethod}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {booking.paymentStatus?.toUpperCase() || 'PAID'}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Contact */}
            {booking.owner && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-3">Vehicle Owner Contact</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                    {booking.owner.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{booking.owner.name}</p>
                    <p className="text-sm text-gray-500">{booking.owner.phone}</p>
                  </div>
                  <a 
                    href={`tel:${booking.owner.phone}`}
                    className="ml-auto px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-6 py-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all shadow-md"
          >
            <Download className="w-5 h-5" />
            Download Invoice & Terms
          </button>
          <Link
            to="/my-bookings"
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-dull transition-all shadow-md"
          >
            View My Bookings
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Terms Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Important Information</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please carry a valid driving license and ID proof during pickup</li>
                <li>• Pickup and return times will be coordinated by the owner</li>
                <li>• Download the invoice for your records and terms & conditions</li>
                <li>• For any queries, contact the vehicle owner directly</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Confetti Animation Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -20, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1 
              }}
              animate={{ 
                y: window.innerHeight + 20,
                rotate: Math.random() * 360,
                opacity: 0
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeIn"
              }}
              className={`absolute w-3 h-3 rounded-full ${
                ['bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-pink-400', 'bg-purple-400'][i % 5]
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
