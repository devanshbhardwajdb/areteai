import React from 'react'
import Link from 'next/link'
import { FaXTwitter, FaLinkedin, FaFacebookF, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='bg-black  bottom-0 gap-3  flex flex-col  items-center justify-center xl:px-[15vw] p-3  lg:min-h-[5vh] min-h-[10vh]  py-5  w-full font-mont  backdrop-blur-sm relative  '>
      
      <div className="flex w-full xl:justify-center justify-evenly pb-4 xl:gap-28 gap-2 border-b border-white/50">

        <div className="flex items-center justify-center cursor-pointer text-white ">
          <Link href="/" className='flex flex-col items-center cursor-pointer'>
            <img alt="logo" src={"/logo.png"} className="cursor-pointer w-10 invert" />
            <h1 className={` font-semibold mb-2`}>Arete AI</h1>
          </Link>
        </div>

        <div className=" flex flex-col  items-start font-normal   relative nav-right transition-all duration-500 text-sm text-white/90">

          <h1 className={` font-semibold mb-2`}>Arete AI</h1>
          <Link href={'/home'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><h1>Home</h1></Link>

          <Link href={'/assessment'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><h1>Assessment</h1></Link>

          <Link href={'/privacypolicy'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><h1>Profile</h1></Link>


        </div>
        <div className=" flex flex-col  items-start font-normal relative nav-right transition-all duration-500 text-sm text-white/90">

          <h1 className={` font-semibold mb-2`}>Company</h1>
          <Link href={'/about'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><h1>About</h1></Link>

          <Link href={'/contact'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><h1>Contact Us</h1></Link>

          <Link href={'/privacypolicy'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><h1>Privacy Policy</h1></Link>

          <Link href={'/terms'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `}><h1>Terms of Service</h1></Link>
        </div>
      </div>
      <div className=" flex  items-center gap-5 font-normal  relative nav-right transition-all duration-500  text-white/90 mt-2 text-2xl">

        <Link href={'/'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><FaFacebookF />
        </Link>

        <Link href={'/about'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><FaXTwitter />
        </Link>

        <Link href={'/assessment'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><FaLinkedin /></Link>

        <Link href={'/assessment'} className={` duration-200 hover:text-[#00a6a6] cursor-pointer `} ><FaInstagram />
        </Link>
      </div>
      <h1 className='text-white/90 max-lg:text-sm text-center'>Copyright © | All Rights Reserved - AreteAI</h1>
    </div>
  )
}

export default Footer