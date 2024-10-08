'use client'
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import Lottie from 'lottie-react';
import A1 from '@/anime3.json';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const Assessment = ({ tokenUserData }) => {
    const router = useRouter();
    const [userClass, setUserClass] = useState('9');
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    console.log(user)
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log(process.env.COUPON_CODE)
        // console.log(couponCode)


        try {
            if (userClass && couponCode === '12345') {
                
                setCouponCode("")
                router.push(`/assessment/${userClass}?c=${couponCode}`)
            }
            else {
                toast.error('Invalid Coupon Code!', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });
            }


        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Invalid credentials', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
        } finally {
            setLoading(false);


        }
    };
 

    useEffect(() => {

    if(!user){
        router.push('/')
    }

    }, [user])

    return (
        <div className="min-h-[100vh] px-[10vw] flex flex-col justify-center items-center font-noto max-md:px-6 max-md:pt-28">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <form
                onSubmit={(e) => handleSubmit(e)}

                className="flex flex-col gap-2 items-center md:w-1/2 w-full h-auto p-8 rounded-lg shadow-lg shadow-gray-900 duration-150 transition-all font-noto  backdrop-blur-md bg-gray-200 border border-gray-600"
            >
                <h3 className="text-black text-2xl font-bold mb-1">Start Assessing Yourself</h3>

                <div className="flex mt-6 gap-8 flex-col w-full">
                    <div className="flex flex-col w-full">
                        <h3 className="text-black text-lg font-medium mb-1">Select your class:</h3>
                        <select
                            name="class"
                            value={userClass}
                            onChange={(e) => { setUserClass(e.target.value) }}
                            className="bg-white rounded-lg p-2 w-full focus:outline-none focus:shadow-md border border-gray-600 focus:border-[#f4ba55] focus:shadow-[#f4ba55] text-black placeholder-gray-400"
                            placeholder="select"
                            required
                        >
                            <option value="9">9th Class</option>
                            <option value="10">10th Class</option>
                            <option value="11">11th Class</option>
                            <option value="12">12th Class</option>
                        </select>



                    </div>
                    <div className="flex flex-col w-full">
                        <h3 className="text-black text-lg font-medium mb-1">Enter the coupon code:</h3>
                        <input
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value) }}
                            type="text"
                            className="bg-white rounded-lg p-2 w-full focus:outline-none focus:shadow-md border border-gray-600 focus:border-[#f4ba55] focus:shadow-[#f4ba55] text-black placeholder-gray-400"
                            placeholder='Enter the Coupon Code'
                            name='couponCode'
                            required
                        />
                    </div>

                </div>

                <button className="nav-btn bg-[#f4ba55] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 hover:shadow-lg w-full flex justify-center items-center mt-5" disabled={loading}>
                    {loading ? <Lottie animationData={A1} loop={true} className="w-6" /> : <p>Continue</p>}
                </button>
            </form>
        </div>
    );
}

export default Assessment;
