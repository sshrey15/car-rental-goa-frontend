import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AdminDashboard = () => {
    const { axios } = useAppContext()
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOwners: 0,
        totalCars: 0,
        totalBookings: 0,
        pendingApprovals: 0
    })

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/stats')
            if (data.success) {
                setStats(data.stats)
            }
        } catch (error) {
            console.log(error)
        }
    }, [axios])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return (
        <div className='flex flex-col gap-6'>
            <h1 className='text-2xl font-bold text-gray-800'>Admin Dashboard</h1>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Total Users</p>
                            <h3 className='text-2xl font-bold mt-1'>{stats.totalUsers}</h3>
                        </div>
                        <div className='p-3 bg-blue-50 rounded-full'>
                            <img src={assets.users_icon} className='w-6 h-6' alt="" />
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Total Vehicles</p>
                            <h3 className='text-2xl font-bold mt-1'>{stats.totalCars}</h3>
                        </div>
                        <div className='p-3 bg-green-50 rounded-full'>
                            <img src={assets.carIcon} className='w-6 h-6' alt="" />
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Total Bookings</p>
                            <h3 className='text-2xl font-bold mt-1'>{stats.totalBookings}</h3>
                        </div>
                        <div className='p-3 bg-purple-50 rounded-full'>
                            <img src={assets.listIcon} className='w-6 h-6' alt="" />
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Pending Approvals</p>
                            <h3 className='text-2xl font-bold mt-1 text-orange-600'>{stats.pendingApprovals}</h3>
                        </div>
                        <div className='p-3 bg-orange-50 rounded-full'>
                            <img src={assets.cautionIconColored} className='w-6 h-6' alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
