import React from 'react';
import { assets } from '../../assets/assets';
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to={"/"}>
        <img className='w-28 lg:w-32' src={assets.logo} alt="Logo" />
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user ? `${user.firstName} ${user.lastName}` : "Developer"}</p>
        {user ? (
          <UserButton />
        ) : (
          <img className='w-8 h-8 rounded-full' src={assets.profile_img} alt="Profile" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
