"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { motion } from 'framer-motion';
import { slideIn3 } from "@/utils/motion";
import Lottie from "lottie-react";
import { useAuth } from '@/context/AuthContext';


const Hero = ({ tokenUserData }) => {
    

    const { user } = useAuth();
    

    return (
        <>
            <Head>
                <title>AreteAI</title>
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
            <motion.div className='  lg:px-[8vw] min-h-[90vh] xl:py-[25vh] py-[10vh]  max-lg:flex-col   flex w-full  items-center justify-center  gap-8'>

                <div className='flex flex-col items-center bg    xl:w-1/2'>

                    <motion.div className="flex relative">
                        <motion.h1
                            variants={slideIn3('left', "tween", 0, 1.0)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.9 }}
                            className='font-noto text-[20vh] max-xl:text-[18vh] max-lg:text-[10vh] max-md:text-[10vh] text-[#f4ba55] pl-5 backdrop  ' >Arete</motion.h1>

                        <motion.h1
                            variants={slideIn3('right', "tween", 0, 1.0)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.9 }}
                            className='font-noto text-[20vh] max-xl:text-[18vh] max-md:text-[10vh] max-lg:text-[10vh] text-black px-5 '>AI</motion.h1>
                    </motion.div>


                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.9 }}
                        className='font-noto  text-black text-[6vh] max-xl:text-[4vh] max-lg:text-[2.4vh] max-md:text-[2vh] '>Actualize your true Potential</motion.h2>


                    <Link href={'/assessment'}><motion.button
                        variants={slideIn3('bottom', "tween", 0, 1.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.9 }}
                        className='bg-[#f4ba55] text-black px-10 mt-5 py-3 font-noto text-lg max-md:text-xs max-md:px-4 max-md:py-2 rounded-full hover:scale-110 duration-300 button1 hover:shadow-md hover:shadow-black hover:duration-200 border border-gray-600 '>Start Assessment</motion.button></Link>

                </div>

            </motion.div>
        </>
    );
}

export default Hero;
