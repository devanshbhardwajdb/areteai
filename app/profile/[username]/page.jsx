"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Lottie from 'lottie-react';
import Loader from "@/docs-loader.json";
import ProfileUser from '@components/ProfileUser';
import { MdAccountCircle } from 'react-icons/md';
import AdminUser from '@components/AdminUser';
import YourAssessments from '@components/YourAssessments';


const Result = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true)
    const { username } = useParams();
    const { user } = useAuth();

    const [menu, setMenu] = useState('profile')



    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user]);


    useEffect(() => {
        const fetchResult = async () => {
            try {
                // Fetch posts 
                const res = await fetch(`/api/auth/checkuserrole?username=${username}`);
                const response = await res.json();

                if (response.success) {
                    setIsAdmin(true)
                }

                setPageLoading(false)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (username) fetchResult();
    }, [username]);



    return (
        <div className="min-h-[100vh] flex flex-col bg-black/60 justify-center mt-14 items-center font-mont ">
            {pageLoading ? (
                <Lottie animationData={Loader} loop={true} className='w-[15vw] p-0 ' />

            ) : (
                <div className="flex max-xl:flex-col items-center h-full w-full font-mont  ">
                    <div className='bg-black/60 h-full max-xl:w-full  xl:w-[20vw] xl:min-h-[100vh] flex xl:flex-col gap-10'>

                        <div className='flex flex-col max-xl:hidden gap-4 items-center pt-10'>
                            {user?.profilepic ?

                                <img alt={`${user?.name}'s profilepic`} className="rounded-full w-28 h-28" src={user.profilepic} ></img>
                                :

                                <MdAccountCircle className='rounded-full w-28 h-28 text-black' />
                            }

                            <h3 className='text-white'>{user?.name}</h3>
                        </div>

                        <div className='flex xl:flex-col justify-evenly w-full max-xl:gap-2'>

                            <button onClick={() => { setMenu('profile') }} className={`${menu === 'profile' ? 'bg-gray-800' : 'bg-none'} py-4 w-full max-xl:px-2 text-white`}>Your Profile</button>
                            <button onClick={() => { setMenu('results') }} className={`${menu === 'results' ? 'bg-gray-800' : 'bg-none'} py-4 w-full max-xl:px-2 text-white`}>Your Assesments</button>

                            {isAdmin && <button onClick={() => { setMenu('admin') }} className={`${menu === 'admin' ? 'bg-gray-800' : 'bg-none'} w-full py-4 max-xl:px-2 text-white`}>Admin Panel</button>}

                        </div>
                    </div>
                    <div className=" min-h-[100vh] h-max w-full">
                        {menu === 'profile' && <ProfileUser />}
                        {menu === 'results' && <YourAssessments />}
                        {menu === 'admin' && <AdminUser />}
                    </div>




                </div>
            )}
        </div>
    );
};

export default Result;
