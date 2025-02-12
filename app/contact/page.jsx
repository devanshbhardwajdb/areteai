"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { motion } from 'framer-motion';
import { slideIn3 } from "@/utils/motion";
import Lottie from "lottie-react";
import { useAuth } from '@/context/AuthContext';


const Contact = () => {


    const { user } = useAuth();

    // console.log(tokenUserData,"me hero hu")


    return (
        <>
            <Head>
                <title>AreteAI - About</title>
                {/* Description */}
                <meta name="description" content="All you need to know about AreteAI" />
                {/* Open Graph metadata for sharing on social media */}
                <meta property="og:title" content="AreteAI" />
                <meta property="og:description" content="All you need to know about AreteAI" />
                <meta property="og:image" content="https://arete-ai.vercel.app/logo.png" />
                {/* Twitter Card metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AreteAI" />
                <meta name="twitter:description" content="All you need to know about AreteAI" />
                <meta name="twitter:image" content="https://arete-ai.vercel.app/logo.png" />
            </Head>
            <motion.div className='  lg:px-[8vw] px-4 min-h-[100vh] xl:py-[25vh] py-[10vh]  flex-col   flex w-full  items-center justify-center   gap-8'>
                    <motion.div className="flex relative">
                        <motion.h1
                            variants={slideIn3('top', "tween", 0, 1.0)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.9 }}
                            className='font-mont text-5xl max-lg:text-3xl font-bold  text-[#00a6a6] pl-5 backdrop  ' >Contact Us</motion.h1>
                    </motion.div>

                <div className='flex flex-col items-center justify-center gap-2 text-justify   '>



                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.9 }}
                        className='font-mont  text-white/90 text-center text-xl max-lg:text-base '>Email: xyz@gmail.com</motion.h2>
                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.9 }}
                        className='font-mont  text-white/90 text-center text-xl max-lg:text-base '>Phone: +91 XXXXXXXXXX</motion.h2>
                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.9 }}
                        className='font-mont  text-white/90 text-center text-xl  max-lg:text-base '>Address: XYZ, Colony, Mall, Gorakhpur</motion.h2>


                </div>

            </motion.div>
        </>
    );
}

export default Contact;
