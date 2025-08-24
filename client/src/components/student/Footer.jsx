import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full'>
        <div className='flex flex-col md:flex-row items-start px-8 justify-center md:px-0 gap-10 md:gap-32 py-10 border-b border-white/30'>
            <div className='flex flex-col md:items-start items-center w-full'>
              <img src={assets.logo_dark} />
              <p className='text-white mt-text-left text-sm text-white/80'>Dummy Data lpre osmdaos opfap fkpoc kopdewopm ewomewovewopvnewokopwemr vorpem vporemvoper opvmre</p>
            </div>
            <div className='flex flex-col md:items-start items-center w-full'>
              <h2 className='font-semibold text-white mb-5'>Company</h2>
              <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
                <li><a href="#">Home</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className='hidden md:flex flex-col items-start w-full'> 
              <h2 className='font-semibold text-white mb-5'>Subscrube to news Letter</h2>
              <p className='text-sm text-white/80'>Latest News</p>
              <div className='flex items-center gap-2 pt-4'>
                <input className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 text-white rounded'  type="email" placeholder='Enter email address' />
                <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
              </div>
            </div>
        </div>
        <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025</p>
    </footer>
  )
}

export default Footer