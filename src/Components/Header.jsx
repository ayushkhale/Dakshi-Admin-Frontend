import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-md p-8 flex items-center justify-between rounded-t-lg">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="md:hidden text-gray-600 text-2xl mr-4">
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="font-bold text-[25px] p-5">Dashboard</h1>
      </div>

      <Link to="/profilecard" className="sm:hidden text-gray-600 text-2xl">
        <i className="fas fa-user-circle"></i>
      </Link>
    </nav>
  );
};

export default Header;
