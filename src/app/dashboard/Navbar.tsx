import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-black text-white flex items-center justify-between p-4 relative">
      <div className="flex items-center">
        {/* Slider Dropdown Toggle */}
        <button className="text-white mr-4">☰</button>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-800 text-white border border-gray-600 rounded-md p-2"
        />
      </div>
      <div className="flex items-center">
        {/* Profile Details */}
        <span className="mr-4">Profile Name</span>
        <img src="/path/to/profile-pic.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
      </div>
    </nav>
  );
};

export default Navbar;
