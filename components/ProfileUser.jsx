'use client'
import React from 'react'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MdAccountCircle } from 'react-icons/md';

const ProfileUser = () => {

    const { user, resetUser } = useAuth();
    const router = useRouter()

    const logout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        const data = await res.json()

        // console.log(data)
        if (data.success) {
            resetUser();
            router.push('/');
        }
    };
    return (
        <div className='flex flex-col font-mont gap-5 items-center justify-start min-h-[90vh] w-full pt-10'>
            {user?.profilepic ?

                <img alt={`${user?.name}'s profilepic`} className="rounded-full w-28 h-28" src={user.profilepic} ></img>
                :

                <MdAccountCircle className='rounded-full w-28 h-28 text-black' />
            }

            <h3 className='text-white text-2xl font-bold'>{user?.name}</h3>

            <div className="flex flex-col items-center gap-2">

                <h3 className='text-white'>Username: {user?.username}</h3>
                <h3 className='text-white'>Email: {user?.email}</h3>
                <button onClick={logout} className='nav-btn  bg-[#00a6a6]  text-black px-5 py-2 rounded-lg  transition-all duration-150  hover:scale-95 ' >Logout</button>
            </div>
        </div>
    )
}

export default ProfileUser
