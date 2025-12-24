import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AdminCoupons = () => {
    const { axios, currency } = useAppContext()
    const [coupons, setCoupons] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minBookingAmount: '',
        maxDiscount: '',
        validFrom: '',
        validUntil: '',
        usageLimit: ''
    })

    const fetchCoupons = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/coupons')
            if (data.success) {
                setCoupons(data.coupons)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [axios])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const endpoint = editingCoupon 
                ? '/api/admin/coupon/update' 
                : '/api/admin/coupon/create'
            
            const payload = editingCoupon 
                ? { couponId: editingCoupon._id, ...formData }
                : formData

            const { data } = await axios.post(endpoint, payload)
            
            if (data.success) {
                toast.success(data.message)
                setShowModal(false)
                resetForm()
                fetchCoupons()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDelete = async (couponId) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return
        
        try {
            const { data } = await axios.post('/api/admin/coupon/delete', { couponId })
            if (data.success) {
                toast.success(data.message)
                fetchCoupons()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleToggleStatus = async (couponId) => {
        try {
            const { data } = await axios.post('/api/admin/coupon/toggle', { couponId })
            if (data.success) {
                toast.success(data.message)
                fetchCoupons()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            minBookingAmount: '',
            maxDiscount: '',
            validFrom: '',
            validUntil: '',
            usageLimit: ''
        })
        setEditingCoupon(null)
    }

    const openEditModal = (coupon) => {
        setEditingCoupon(coupon)
        setFormData({
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minBookingAmount: coupon.minBookingAmount || '',
            maxDiscount: coupon.maxDiscount || '',
            validFrom: coupon.validFrom.split('T')[0],
            validUntil: coupon.validUntil.split('T')[0],
            usageLimit: coupon.usageLimit || ''
        })
        setShowModal(true)
    }

    useEffect(() => {
        fetchCoupons()
    }, [fetchCoupons])

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-gray-800'>Manage Coupons</h1>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dull transition-colors'
                >
                    + Add Coupon
                </button>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
                            <tr>
                                <th className='p-4 font-medium'>Code</th>
                                <th className='p-4 font-medium'>Discount</th>
                                <th className='p-4 font-medium'>Validity</th>
                                <th className='p-4 font-medium'>Usage</th>
                                <th className='p-4 font-medium'>Status</th>
                                <th className='p-4 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm'>
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                    <td className='p-4'>
                                        <div>
                                            <p className='font-bold text-primary'>{coupon.code}</p>
                                            <p className='text-xs text-gray-500'>{coupon.description}</p>
                                        </div>
                                    </td>
                                    <td className='p-4'>
                                        <p className='font-medium'>
                                            {coupon.discountType === 'percentage' 
                                                ? `${coupon.discountValue}%` 
                                                : `${currency}${coupon.discountValue}`
                                            }
                                        </p>
                                        {coupon.maxDiscount && (
                                            <p className='text-xs text-gray-500'>Max: {currency}{coupon.maxDiscount}</p>
                                        )}
                                        {coupon.minBookingAmount > 0 && (
                                            <p className='text-xs text-gray-500'>Min: {currency}{coupon.minBookingAmount}</p>
                                        )}
                                    </td>
                                    <td className='p-4'>
                                        <p className='text-xs'>From: {new Date(coupon.validFrom).toLocaleDateString()}</p>
                                        <p className='text-xs'>To: {new Date(coupon.validUntil).toLocaleDateString()}</p>
                                    </td>
                                    <td className='p-4'>
                                        <p className='font-medium'>
                                            {coupon.usedCount} / {coupon.usageLimit || '∞'}
                                        </p>
                                    </td>
                                    <td className='p-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            coupon.isActive 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='p-4'>
                                        <div className='flex gap-2'>
                                            <button 
                                                onClick={() => openEditModal(coupon)}
                                                className='px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100'
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(coupon._id)}
                                                className={`px-3 py-1 rounded text-xs ${
                                                    coupon.isActive 
                                                    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                            >
                                                {coupon.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(coupon._id)}
                                                className='px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan="6" className='p-8 text-center text-gray-500'>
                                        No coupons found. Create your first coupon!
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
                    <div className='bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
                        <h2 className='text-xl font-bold mb-4'>
                            {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                        </h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Coupon Code</label>
                                <input
                                    type='text'
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                    placeholder='e.g. SUMMER20'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                <input
                                    type='text'
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                    placeholder='e.g. Summer sale discount'
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                    >
                                        <option value='percentage'>Percentage</option>
                                        <option value='fixed'>Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Discount Value {formData.discountType === 'percentage' ? '(%)' : `(${currency})`}
                                    </label>
                                    <input
                                        type='number'
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Min Booking ({currency})</label>
                                    <input
                                        type='number'
                                        value={formData.minBookingAmount}
                                        onChange={(e) => setFormData({...formData, minBookingAmount: e.target.value})}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                        placeholder='Optional'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Max Discount ({currency})</label>
                                    <input
                                        type='number'
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                        placeholder='Optional'
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Valid From</label>
                                    <input
                                        type='date'
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Valid Until</label>
                                    <input
                                        type='date'
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                                        className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Usage Limit</label>
                                <input
                                    type='number'
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 outline-primary'
                                    placeholder='Leave empty for unlimited'
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
                                    {editingCoupon ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCoupons
