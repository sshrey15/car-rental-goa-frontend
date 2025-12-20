import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AdminBookings = () => {
    const { axios, currency } = useAppContext()
    const [bookings, setBookings] = useState([])

    const fetchBookings = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/bookings')
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [axios])

    useEffect(() => {
        fetchBookings()
    }, [fetchBookings])

    return (
        <div className='flex flex-col gap-6'>
            <h1 className='text-2xl font-bold text-gray-800'>All Bookings</h1>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
                            <tr>
                                <th className='p-4 font-medium'>Vehicle</th>
                                <th className='p-4 font-medium'>Customer</th>
                                <th className='p-4 font-medium'>Owner</th>
                                <th className='p-4 font-medium'>Dates</th>
                                <th className='p-4 font-medium'>Amount</th>
                                <th className='p-4 font-medium'>Status</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm'>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                    <td className='p-4'>
                                        <div className='flex items-center gap-3'>
                                            <img src={booking.car?.image || booking.car?.images?.[0]} alt="" className='w-10 h-10 rounded-lg object-cover' />
                                            <div>
                                                <p className='font-medium text-gray-900'>{booking.car?.brand} {booking.car?.model}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='p-4'>
                                        <div>
                                            <p className='font-medium'>{booking.user?.name}</p>
                                            <p className='text-xs text-gray-500'>{booking.user?.phone}</p>
                                        </div>
                                    </td>
                                    <td className='p-4'>
                                        <div>
                                            <p className='font-medium'>{booking.owner?.name}</p>
                                            <p className='text-xs text-gray-500'>{booking.owner?.phone}</p>
                                        </div>
                                    </td>
                                    <td className='p-4'>
                                        <div className='text-xs'>
                                            <p>From: {new Date(booking.pickupDate).toLocaleDateString()}</p>
                                            <p>To: {new Date(booking.returnDate).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className='p-4 font-medium'>
                                        {currency}{booking.price}
                                    </td>
                                    <td className='p-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminBookings
