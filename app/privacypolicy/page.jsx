"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { motion } from 'framer-motion';
import { slideIn3 } from "@/utils/motion";
import Lottie from "lottie-react";
import { useAuth } from '@/context/AuthContext';


const PrivcacyPolicy = () => {


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
                            className='font-mont text-4xl max-lg:text-3xl font-bold  text-[#00a6a6] pl-5 backdrop  ' >Privacy Policy</motion.h1>
                    </motion.div>


                    <motion.h2
                        variants={slideIn3('top', "tween", 0, 2.0)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.7 }}
                        className='font-mont  text-white/90 text-justify text-xl  max-lg:text-sm '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis hic error molestiae illo est quod officia repellendus at voluptas, non dignissimos maxime facere quaerat! Neque iusto magnam fugiat? Placeat recusandae quam omnis ex et eius expedita. Sit repudiandae quas, hic quis accusantium, maiores expedita quae voluptas eos labore sed placeat sapiente debitis inventore, doloribus obcaecati? Distinctio est, exercitationem dolor soluta explicabo atque blanditiis necessitatibus ut reiciendis voluptatem quisquam iure quasi nemo iste. Autem pariatur obcaecati labore ut repellendus corporis eligendi quae animi fugit fuga. Molestias, harum necessitatibus voluptas, laudantium dolor atque, minus quibusdam ex ipsam doloremque tenetur. Libero repellat accusantium sequi exercitationem expedita molestias optio! Eius iusto, perspiciatis ea qui veniam provident rerum nemo quae odit, non velit aperiam mollitia voluptatibus animi amet pariatur nesciunt harum fugiat. Excepturi magnam dolores illo impedit magni vitae natus tempore. Alias fuga minus hic ab nihil natus architecto reiciendis. Voluptatem at, nam veritatis explicabo est illum laboriosam, ipsam odio eligendi itaque vero iusto maiores autem iure quis sunt minima. Rerum magni, repellat ducimus, officia sit veniam doloremque voluptate, laboriosam adipisci neque quae iste illum iure voluptas quam reprehenderit.</motion.h2>


                </div>

            </motion.div>
        </>
    );
}

export default PrivcacyPolicy;
