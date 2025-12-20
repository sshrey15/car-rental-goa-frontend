import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AdminCars = () => {
    const { axios, currency } = useAppContext()
    const [cars, setCars] = useState([])

    const fetchCars = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/cars')
            if (data.success) {
                setCars(data.cars)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [axios])

    const toggleApproval = async (carId, currentStatus) => {
        try {
            const { data } = await axios.post('/api/admin/approve-car', {
                carId,
                isApproved: !currentStatus
            })
            if (data.success) {
                toast.success(data.message)
                fetchCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchCars()
    }, [fetchCars])

    return (
        <div className='flex flex-col gap-6'>
            <h1 className='text-2xl font-bold text-gray-800'>Manage Vehicles</h1>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
                            <tr>
                                <th className='p-4 font-medium'>Vehicle</th>
                                <th className='p-4 font-medium'>Owner</th>
                                <th className='p-4 font-medium'>Price/Day</th>
                                <th className='p-4 font-medium'>Status</th>
                                <th className='p-4 font-medium'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm'>
                            {cars.map((car) => (
                                <tr key={car._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                    <td className='p-4'>
                                        <div className='flex items-center gap-3'>
                                            <img src={car.images[0]} alt="" className='w-12 h-12 rounded-lg object-cover' />
                                            <div>
                                                <p className='font-medium text-gray-900'>{car.brand} {car.model}</p>
                                                <p className='text-xs text-gray-500'>{car.year} • {car.fuel_type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='p-4'>
                                        <div>
                                            <p className='font-medium'>{car.owner?.name}</p>
                                            <p className='text-xs text-gray-500'>{car.owner?.phone}</p>
                                        </div>
                                    </td>
                                    <td className='p-4 font-medium'>
                                        {currency}{car.pricePerDay}
                                    </td>
                                    <td className='p-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            car.isApproved 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {car.isApproved ? 'Published' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className='p-4'>
                                        <button 
                                            onClick={() => toggleApproval(car._id, car.isApproved)}
                                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                                car.isApproved
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                        >
                                            {car.isApproved ? 'Unpublish' : 'Approve'}
                                        </button>
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

export default AdminCars
