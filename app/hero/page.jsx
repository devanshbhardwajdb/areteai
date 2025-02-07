"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { motion } from 'framer-motion';
import { slideIn3 } from "@/utils/motion";
import Lottie from "lottie-react";
import { useAuth } from '@/context/AuthContext';


const Hero = () => {


    const { user } = useAuth();

    // console.log(tokenUserData,"me hero hu")


    return (
        <>
            <Head>
                <title>AreteAI - Home</title>
                {/* Description */}
                <meta name="description" content="Actualize your true potential" />
                {/* Open Graph metadata for sharing on social media */}
                <meta property="og:title" content="AreteAI" />
                <meta property="og:description" content="Actualize your true potential" />
                <meta property="og:image" content="https://arete-ai.vercel.app/logo.png" />
                {/* Twitter Card metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AreteAI" />
                <meta name="twitter:description" content="Actualize your true potential" />
                <meta name="twitter:image" content="https://arete-ai.vercel.app/logo.png" />
            </Head>
            <motion.div className='  lg:px-[8vw] min-h-[90vh]  xl:py-[28vh] py-[10vh]  max-lg:flex-col   flex w-full  items-center justify-center relative  gap-8 '>

          
                <div className="loader z-[-50] w-[50vw] h-[80vh] max-xl:h-[30vh] max-xl:w-[90vw]">
                    <div className="loader_blob loader_blob--color"></div>
                </div>

                <div className='flex flex-col items-center  text-white/90  xl:w-1/2 '>

                    <motion.div className="flex relative font-mont font-extrabold ">
                        <motion.h1
                            variants={slideIn3('left', "tween", 0, 1.0)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.9 }}
                            className=' text-[20vh] max-xl:text-[18vh] max-lg:text-[7vh]  text-[#00a6a6] pl-5 backdrop leading  ' >Arete</motion.h1>

                        <motion.h1
                            variants={slideIn3('right', "tween", 0, 1.0)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.9 }}
                            className=' text-[20vh] max-xl:text-[18vh] max-lg:text-[7vh] text-white/90 px-5  '>AI</motion.h1>
                    </motion.div>


                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.9 }}
                        className='font-mont text-[5.5vh]  max-xl:text-[4vh] max-lg:text-[2.4vh] max-md:text-[2vh] '>Actualize your true Potential</motion.h2>


                    {user ? <Link href={``}><motion.button
                        variants={slideIn3('bottom', "tween", 0, 1.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.9 }}
                        className='bg-[#00a6a6] text-black px-10 mt-10 py-3 font-mont text-lg max-md:text-xs max-md:px-4 max-md:py-2 rounded-full  duration-300   hover:shadow-md hover:shadow-black hover:scale-95'>Start Assessment</motion.button>
                    </Link> : <Link href={'/signin'}><motion.button
                        variants={slideIn3('bottom', "tween", 0, 1.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.9 }}
                        className='bg-[#00a6a6] text-black px-10 mt-10 py-3 font-mont text-lg max-md:text-xs max-md:px-4 max-md:py-2 rounded-full duration-300  hover:shadow-md hover:shadow-black  '>Sign in to continue</motion.button>
                    </Link>
                    }

                </div>

            </motion.div>
        </>
    );
}

export default Hero;
