import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AdminUsers = () => {
    const { axios } = useAppContext()
    const [users, setUsers] = useState([])

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/users')
            if (data.success) {
                setUsers(data.users)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [axios])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return (
        <div className='flex flex-col gap-6'>
            <h1 className='text-2xl font-bold text-gray-800'>All Users</h1>

            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
                            <tr>
                                <th className='p-4 font-medium'>User</th>
                                <th className='p-4 font-medium'>Contact</th>
                                <th className='p-4 font-medium'>Role</th>
                                <th className='p-4 font-medium'>Joined</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm'>
                            {users.map((user) => (
                                <tr key={user._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                    <td className='p-4'>
                                        <div className='flex items-center gap-3'>
                                            {user.image ? (
                                                <img src={user.image} alt="" className='w-10 h-10 rounded-full object-cover' />
                                            ) : (
                                                <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold'>
                                                    {user.name?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className='font-medium text-gray-900'>{user.name}</p>
                                                <p className='text-xs text-gray-500'>{user.email || 'No Email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='p-4 font-medium'>
                                        {user.phone}
                                    </td>
                                    <td className='p-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className='p-4 text-gray-500'>
                                        {new Date(user.createdAt).toLocaleDateString()}
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

export default AdminUsers
