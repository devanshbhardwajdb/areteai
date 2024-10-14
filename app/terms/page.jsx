"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { motion } from 'framer-motion';
import { slideIn3 } from "@/utils/motion";
import Lottie from "lottie-react";
import { useAuth } from '@/context/AuthContext';


const Terms = () => {


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
                            className='font-mont text-4xl font-bold  text-[#00a6a6] pl-5 backdrop  ' >Terms & Conditions</motion.h1>
                    </motion.div>


                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.9 }}
                        className='font-mont  text-white/90 text-justify text-xl  max-lg:text-lg '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio nemo officiis odit laboriosam recusandae deserunt quisquam pariatur omnis, ullam quasi reiciendis! Autem repudiandae eius magnam ab? Labore delectus iste exercitationem. Dolore nobis similique incidunt facilis totam expedita voluptates illum, aspernatur earum explicabo. Odio ipsa voluptatibus sapiente fugit repellat, porro nesciunt ab incidunt necessitatibus. Necessitatibus dolore voluptate error ipsa fugit incidunt iste maiores, sapiente ratione nobis laudantium? Repudiandae vitae excepturi minus aliquid ipsa aut! Magni atque laborum eos, repellendus vitae doloribus voluptates natus perferendis sint. Eos magnam ipsam doloribus atque velit provident nostrum facere soluta fugiat blanditiis in, debitis officia omnis voluptatem impedit dignissimos ab nisi sunt dolorum, natus voluptas delectus similique veniam corrupti. Voluptatem assumenda sapiente asperiores odit natus quia, hic facilis, eaque quasi eos, recusandae totam sit accusamus voluptate fugiat. Quae, consectetur explicabo esse exercitationem ratione animi voluptas molestias voluptatibus laboriosam iste fugiat, accusamus aut repudiandae sequi nam ipsa facere eius. Eligendi voluptates perspiciatis odit rerum impedit enim soluta ratione vel cum sunt ullam et quo sapiente eius vero provident aliquam, dignissimos molestias! Perferendis, laudantium. Officiis, delectus quia. Ipsam vitae consequatur aspernatur exercitationem minus repellat. Et voluptatibus, ipsum quo odit doloremque optio sed magnam temporibus eaque quam nemo maxime.</motion.h2>


                </div>

            </motion.div>
        </>
    );
}

export default Terms;
