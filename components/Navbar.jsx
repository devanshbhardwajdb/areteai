'use client'
import React, { useRef, useEffect, useState  } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { navVariants } from "@/utils/motion";
import { useRouter } from 'next/navigation';
import { MdAccountCircle } from 'react-icons/md';


const Navbar = ({ tokenUserData,logout}) => {
  const ref6 = useRef();
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const [menu, setMenu] = useState(false)



  const toggleMenu = () => {
    setMenu(!menu)
  }

  useEffect(() => {
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    const dropdownElement = ref6.current;

    if (dropdownElement) {
      dropdownElement.style.top = `${navbarHeight + 2}px`;
    }
  }, [dropdown]);



  return (

    // THIS IS THE MAIN NAVABR DIV
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        whileInView="show"
        id='navbar'
        className="nav fixed  top-0 z-10 backdrop-blur-lg  flex justify-between items-center p-4 transition-all duration-300 px-[15vw] nav_head h-[8vh] bg-[#ffd080] text-black  font-poppins w-[100vw]"

      >
        <div className="flex items-center nav-left cursor-pointer ">
          <a href="/" className='items cursor-pointer'>
            <img alt="logo" src={"/long_logo.png"} className="cursor-pointer w-40" />
          </a>
        </div>




        <div className=" flex  items-center gap-20 font-normal max-xl:hidden  relative nav-right transition-all duration-500 text-base">

          <Link href={'/'} className={` hover:underline-offset-8 hover:underline hover:scale-[1.1] duration-200 items cursor-pointer `} ><h1>Home</h1></Link>

          <Link href={'/about'} className={` hover:underline-offset-8 hover:underline hover:scale-[1.1] duration-200 items cursor-pointer `} ><h1>About</h1></Link>

          <Link href={'/assessment'} className={` hover:underline-offset-8 hover:underline hover:scale-[1.1] duration-200 items cursor-pointer `} ><h1>Assessment</h1></Link>





          {!tokenUserData ?
            <div className='flex gap-3'>

              <Link href={'/signin'}><button className='nav-btn  bg-[#f4ba55] text-white px-5 py-2 rounded-lg  transition-all duration-150  hover:scale-95  hover:shadow-lg  w-full flex  justify-center items-center text-shadow2' >

                Sign In
              </button></Link>
            </div>
            : (

              <div className='lg:relative  flex gap-2'>


                {tokenUserData && <>

                  <div onClick={() => { setDropdown(prevState => !prevState); }} className=' cursor-pointer   p-3 flex items-center justify-center'>

                    {tokenUserData?.profilepic ?

                      <img alt={`${tokenUserData?.name}'s profilepic`} className="rounded-full w-10 h-10" src={tokenUserData?.profilepic} onError={(e) => { e.target.src = 'fallback_image_url'; }} ></img>
                      :

                      <MdAccountCircle className='rounded-full w-10 h-10 text-black' />
                    }
                  </div></>}

                {dropdown &&

                  <div
                    ref={ref6}
                    className="dropdown  bg-gray-200 absolute right-0 max-lg:left-0  px-10  pt-6 pb-4 rounded-lg lg:rounded-tr-none gap-5 flex flex-col shadow-md shadow-gray-900 border border-gray-600   "
                  >

                    <Link href={`/Profile/${tokenUserData?.username}`} className={` hover:underline-offset-8 hover:underline hover:scale-[1.01] duration-200 items cursor-pointer `} ><h4>My Profile</h4></Link>
                    <button onClick={logout} className='nav-btn  bg-[#ffd080]  text-black px-5 py-2 rounded-lg  transition-all duration-150  hover:scale-95 ' >Logout</button>

                  </div>

                }

              </div>
            )
          }

        </div>

        {/* THIS NAV FOR MOBILE DEVICE */}


        <div className={` flex fixed max-sm:w-[50vw] top-[8vh] w-[30vw] p-5 z-[300]  right-0 flex-col bg-gray-200 text-base  items-start gap-10 font-light   nav-right shadow-md shadow-gray-900 border border-t-0 border-gray-600  duration-500 transform transition-transform  lg:hidden ${menu ? "translate-x-0" : "translate-x-full"}`}>
          <Link href={'/'} className={` hover:underline-offset-8 hover:underline hover:scale-[1.1] duration-200 items cursor-pointer `} ><h1>Home</h1></Link>

          <Link href={'/about'} className={` hover:underline-offset-8 hover:underline hover:scale-[1.1] duration-200 items cursor-pointer `} ><h1>About</h1></Link>

          <Link href={'/assessment'} className={` hover:underline-offset-8 hover:underline hover:scale-[1.1] duration-200 items cursor-pointer `} ><h1>Assessment</h1></Link>

          {!tokenUserData ?
            <div className='flex gap-3'>



              <Link href={'/signin'}><button className='nav-btn  bg-[#f4ba55] text-white px-5 py-2 rounded-lg  transition-all duration-150  hover:scale-95  hover:shadow-lg  w-full flex  justify-center items-center text-shadow2' >

                Sign In
              </button></Link>
            </div>
            : (

              <>
                <Link href={`/Profile/${tokenUserData?.username}`} className={` hover:text-[#f4ba55] hover:shadow-glow hover:scale-[1.1] duration-200 items cursor-pointer `} ><h1>Your Profile</h1></Link>
                <button onClick={logout} className='nav-btn  bg-[#ffd080]  text-black px-5 py-2 rounded-lg  transition-all duration-150  hover:scale-95 ' >Logout</button>
              </>


            )
          }


        </div>
        <div className='absolute  right-11 xl:hidden transition-all duration-500 ' onClick={() => { setMenu(!menu) }}>
          {/* <img src={"/assets/icons/menu-bar.svg"} width={30} height={30} className='cursor-pointer invert burger max-xl:rotate-0 transition-all duration-500 '></img> */}
          <div className="burger flex  flex-col items-end gap-1">
            <div className={`line1 border-2 border-black rounded-full ${menu ? "w-4" : "w-8"} duration-200 `}></div>
            <div className={`line1 border-2 border-black rounded-full ${menu ? "w-4" : "w-8"} duration-200 `}></div>
            <div className={`line1 border-2 border-black rounded-full ${menu ? "w-8" : "w-4"} duration-200`}></div>
          </div>


        </div>
      </motion.nav >


    </>
  );
}




export default Navbar;