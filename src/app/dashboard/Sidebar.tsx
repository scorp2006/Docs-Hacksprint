import React from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="bg-gray-800 text-white w-64 h-full fixed top-0 left-0 p-4">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <ul>
        <li className="mb-2 hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => handleNavigation('/home')}>Home</li>
        {/* Add more navigation items here */}
      </ul>
    </div>
  );
};

export default Sidebar;
