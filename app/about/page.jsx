"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { motion } from 'framer-motion';
import { slideIn3 } from "@/utils/motion";
import Lottie from "lottie-react";
import { useAuth } from '@/context/AuthContext';


const About = () => {


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
            <motion.div className='  lg:px-[8vw] px-4 min-h-[100vh] xl:py-[25vh] py-[10vh]  max-lg:flex-col   flex w-full  items-center justify-center   gap-8'>
                
                <div className='flex flex-col items-center justify-center gap-6 text-cente    '>

                    <motion.div className="flex relative">
                        <motion.h1
                            variants={slideIn3('top', "tween", 0, 1.0)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.9 }}
                            className='font-mont text-4xl max-lg:text-3xl font-bold  text-[#00a6a6] pl-5 backdrop  ' >About Us</motion.h1>
                    </motion.div>


                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.7 }}
                        className='font-mont  text-white/90 text-justify text-xl max-lg:text-sm '>We provide the solution to guide to your future through analysing your potential, through our assessments and providing a one solution for all the students out there.<br/>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum maiores est corrupti ad at quis accusamus vero accusantium? Consequuntur eius nihil quo voluptatem animi consectetur sit, et tempore similique quaerat dolor in autem, reprehenderit optio ducimus neque quasi expedita tenetur harum est quae nisi distinctio eum illum. Corrupti, laudantium laborum! Necessitatibus reprehenderit dolores id aliquid iusto et veniam fugiat. Ipsa, possimus? Repellat, doloremque necessitatibus? Fugit veniam ex similique molestias nisi id, obcaecati quos magnam nam. Eaque nesciunt nisi velit quis ipsum cum ex quos alias numquam? Sed aliquam impedit provident ad blanditiis ipsa? Eveniet nesciunt excepturi laboriosam illum, velit non!</motion.h2>


                </div>

            </motion.div>
        </>
    );
}

export default About;
