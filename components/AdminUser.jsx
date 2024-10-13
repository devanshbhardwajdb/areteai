'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MdAccountCircle } from 'react-icons/md';
import AddClass from './AddClass';

const AdminUser = () => {

    const { user, resetUser } = useAuth();
    const [menu, setMenu] = useState('addclass')



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
        <div className='flex flex-col font-mont items-center justify-start pt-10 w-full min-h-[100vh]'>


            <h3 className='text-white text-3xl max-xl:text-xl font-bold'>You are the Admin of this Website</h3>

            <div className="flex  justify-evenly bg-black/60  w-full mt-5 h-16">

                <button onClick={() => { setMenu('addclass') }} className={`${menu === 'addclass' ? 'bg-gray-800' : 'bg-none'} py-4 text-white w-full`}>Add Nth Class</button>

                <button onClick={() => { setMenu('addintelligence') }} className={`${menu === 'addintelligence' ? 'bg-gray-800' : 'bg-none'} py-4 text-white w-full`}>Add Intelligence</button>



            </div>

            <div className="w-full bg-black/60 ">
                {menu === 'addclass' && < AddClass />}
                {/* {menu === 'addintelligence' && <AddIntelligence />} */}
            </div>
        </div>
    )
}

export default AdminUser
