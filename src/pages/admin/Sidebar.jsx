import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const Sidebar = () => {
    const location = useLocation()
    const { logout } = useAppContext()

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: assets.dashboardIcon },
        { path: '/admin/cars', label: 'Manage Vehicles', icon: assets.carIcon },
        { path: '/admin/bookings', label: 'All Bookings', icon: assets.listIcon },
        { path: '/admin/users', label: 'All Users', icon: assets.users_icon },
    ]

    return (
        <div className='w-[18%] min-h-screen border-r-2 border-gray-100 bg-white hidden md:block'>
            <div className='flex flex-col gap-2 pt-6 pl-[20%] text-[15px]'>
                {menuItems.map((item) => (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-l-lg cursor-pointer ${location.pathname === item.path ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                    >
                        <img className='w-5 h-5' src={item.icon} alt="" />
                        <p className='hidden lg:block font-medium text-gray-600'>{item.label}</p>
                    </Link>
                ))}
                
                <div onClick={logout} className='flex items-center gap-3 px-3 py-2 rounded-l-lg cursor-pointer mt-10 hover:bg-gray-50'>
                    <img className='w-5 h-5 rotate-180' src={assets.arrow_icon} alt="" />
                    <p className='hidden lg:block font-medium text-gray-600'>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
