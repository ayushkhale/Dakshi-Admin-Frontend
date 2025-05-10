import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import networkconfig from '../Dynamics/networkconfig';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isSubmissionOpen, setSubmissionOpen] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${networkconfig.BASE_URL}/admin/logout`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        navigate('/login');
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const Dropdown = ({ label, isOpen, toggle, items, icon }) => (
  <div>
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
    >
      <span className="flex items-center space-x-2">
        <i className={`fas fa-${icon}`}></i>
        <span>{label}</span>
      </span>
      <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
    </button>
    {isOpen && (
      <div className="ml-4 space-y-2 mt-1">
        {items.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-700 ${
              location.pathname === item.path ? 'bg-gray-700 font-bold' : ''
            }`}
            onClick={toggleSidebar}
          >
            <i className={`fas fa-${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    )}
  </div>
);

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-4 transform z-10 w-64 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-64'
      } md:translate-x-0 md:relative`}
    >
      <div className="text-xl font-bold mb-8 flex justify-between items-center">
        <img
          src="https://i.ibb.co/fVmN4CbS/20250426-152325.png"
          alt="Logo"
          className="w-28"
        />
        <button onClick={toggleSidebar} className="ml-4 md:hidden text-white">
          <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
        </button>
      </div>
      

      <nav className="space-y-4 px-2">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-700 ${
            location.pathname === '/dashboard' ? 'bg-gray-700 font-bold' : ''
          }`}
          onClick={toggleSidebar}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>

         <Link
          to="/docs"
          className={`flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-700 ${
            location.pathname === '/docs' ? 'bg-gray-700 font-bold' : ''
          }`}
          onClick={toggleSidebar}
        >
          <i className="fas fa-folder"></i>
          <span>Documents</span>
        </Link>

        <Dropdown
          label="Generate"
          isOpen={isCreateOpen}
          toggle={() => setCreateOpen(!isCreateOpen)}
          items={[
            { icon: 'certificate', label: 'Certificate', path: '/certificate' },
            { icon: 'address-card', label: 'ID Card', path: '/generate-id' },
            { icon: 'rug', label: 'Offer Letter', path: '/offer-letter' },
            { icon: 'receipt', label: 'Slip Generator', path: '/slip' },
          ]}
           icon="plus-square"
        />

        <Dropdown
          label="Add"
          isOpen={isUpdateOpen}
          toggle={() => setUpdateOpen(!isUpdateOpen)}
          items={[
            { icon: 'calendar', label: 'Add Event', path: '/addevents' },
            { icon: 'user-group', label: 'Add Team', path: '/team' },
            { icon: 'user-pen', label: 'Add Partners', path: '/partners' },
            { icon: 'image', label: 'Add Pictures', path: '/addprograms' },
          ]}
          icon="user-plus"
        />

        <Dropdown
          label="Delete"
          isOpen={isDeleteOpen}
          toggle={() => setDeleteOpen(!isDeleteOpen)}
          items={[
            { icon: 'calendar-xmark', label: 'Delete Event', path: '/delete-events' },
            { icon: 'user-xmark', label: 'Delete Team', path: '/delete-team' },
            { icon: 'user-minus', label: 'Delete Partners', path: '/delete-partners' },
            { icon: 'images', label: 'Delete Pictures', path: '/delete-programs' },
          ]}
          icon="trash"
        />

        <Dropdown
          label="Responses"
          isOpen={isSubmissionOpen}
          toggle={() => setSubmissionOpen(!isSubmissionOpen)}
          items={[
            { icon: 'user-tie', label: 'Internship Forms', path: '/InternshipForm' },
            { icon: 'envelope', label: 'Contact Messages', path: '/ContactForm' },
          ]}
          icon="inbox"
        />

        <button
          className="flex items-center space-x-3 text-gray-300 hover:text-red-500 hover:font-semibold"
          onClick={() => {
            handleLogout();
            toggleSidebar();
          }}
        >
          <i className="fas fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
