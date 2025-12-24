import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AdminLocations = () => {
    const { axios } = useAppContext()
    const [locations, setLocations] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingLocation, setEditingLocation] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    const fetchLocations = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/locations')
            if (data.success) {
                setLocations(data.locations)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [axios])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const endpoint = editingLocation 
                ? '/api/admin/location/update' 
                : '/api/admin/location/create'
            
            const payload = editingLocation 
                ? { locationId: editingLocation._id, ...formData }
                : formData

            const { data } = await axios.post(endpoint, payload)
            
            if (data.success) {
                toast.success(data.message)
                setShowModal(false)
                resetForm()
                fetchLocations()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDelete = async (locationId) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return
        
        try {
            const { data } = await axios.post('/api/admin/location/delete', { locationId })
            if (data.success) {
                toast.success(data.message)
                fetchLocations()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleToggleStatus = async (locationId) => {
        try {
            const { data } = await axios.post('/api/admin/location/toggle', { locationId })
            if (data.success) {
                toast.success(data.message)
                fetchLocations()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: ''
        })
        setEditingLocation(null)
    }

    const openEditModal = (location) => {
        setEditingLocation(location)
        setFormData({
            name: location.name,
            description: location.description || ''
        })
        setShowModal(true)
    }

    useEffect(() => {
        fetchLocations()
    }, [fetchLocations])

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-gray-800'>Manage Locations</h1>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dull transition-colors'
                >
                    + Add Location
                </button>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
                            <tr>
                                <th className='p-4 font-medium'>Location Name</th>
                                <th className='p-4 font-medium'>Description</th>
                                <th className='p-4 font-medium'>Status</th>
                                <th className='p-4 font-medium'>Created</th>
                                <th className='p-4 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm'>
                            {locations.map((location) => (
                                <tr key={location._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                    <td className='p-4'>
                                        <p className='font-medium text-gray-900'>{location.name}</p>
                                    </td>
                                    <td className='p-4'>
                                        <p className='text-gray-500'>{location.description || '-'}</p>
                                    </td>
                                    <td className='p-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            location.isActive 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                            {location.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='p-4'>
                                        <p className='text-xs text-gray-500'>
                                            {new Date(location.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className='p-4'>
                                        <div className='flex gap-2'>
                                            <button 
                                                onClick={() => openEditModal(location)}
                                                className='px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100'
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(location._id)}
                                                className={`px-3 py-1 rounded text-xs ${
                                                    location.isActive 
                                                    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                            >
                                                {location.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(location._id)}
                                                className='px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {locations.length === 0 && (
                                <tr>
                                    <td colSpan="5" className='p-8 text-center text-gray-500'>
                                        No locations found. Add your first location!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl p-6 w-full max-w-md'>
                        <h2 className='text-xl font-bold mb-4'>
                            {editingLocation ? 'Edit Location' : 'Add New Location'}
                        </h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Location Name</label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                    placeholder='e.g. Calangute Beach'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                    placeholder='Brief description of the location'
                                    rows={3}
                                />
                            </div>
                            <div className='flex gap-3 mt-4'>
                                <button
                                    type='button'
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className='flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull'
                                >
                                    {editingLocation ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminLocations
