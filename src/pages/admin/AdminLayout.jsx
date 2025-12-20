import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import NavbarOwner from '../../components/owner/NavbarOwner'

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Invalid Password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white p-8 rounded-xl shadow-lg w-96'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Admin Access</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                Enter Admin Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                placeholder='Password'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
        <NavbarOwner />
        <div className='flex items-start'>
            <Sidebar />
            <div className='w-full md:w-[82%] p-6'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default AdminLayout
