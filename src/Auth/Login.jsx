import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomModal from '../Components/CustomModal';
import networkconfig from '../Dynamics/networkconfig';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');

  const handleApiError = (error) => {
    if (!error.response) {
      setModalTitle("Network Error");
      setModalMessage("Check your internet connection.");
    } else {
      const { status } = error.response;
      switch (status) {
        case 400:
          setModalTitle("Bad Request");
          setModalMessage("Invalid credentials.");
          break;
        case 401:
          setModalTitle("Unauthorized");
          setModalMessage("Incorrect username or password.");
          break;
        case 403:
          setModalTitle("Access Denied");
          setModalMessage("You don't have permission.");
          break;
        case 404:
          setModalTitle("Not Found");
          setModalMessage("User not found.");
          break;
        case 500:
          setModalTitle("Server Error");
          setModalMessage("Please try again later.");
          break;
        default:
          setModalTitle("Error");
          setModalMessage("Something went wrong.");
          break;
      }
    }
    setModalType("error");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${networkconfig.BASE_URL}/v1/login`,
        { username, password },
        { withCredentials: true }
      );

      if (!response || response.status !== 200) {
        throw new Error("Invalid response from server");
      }

      console.log(response)

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', response.data.token);

      setModalTitle("Login Successful");
      setModalMessage("Redirecting to dashboard...");
      setModalType("success");
      setModalOpen(true);

      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 2000);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setError('')
    }, 4000);
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#111827]">
      <div className="relative m-10 sm:p-6 w-11/12 sm:w-96 bg-[#1f2937] p-8 shadow-xl rounded-xl outline-dashed outline-gray-400">
        <div className="flex justify-center mb-3">
          <img src="https://i.ibb.co/fVmN4CbS/20250426-152325.png" alt="Dakshi Foundation" className="w-28 mb-10" />
        </div>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>} 
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
           {loading ? "Login In..." : "Login"}
          </button>
        </form>
        <div className="flex items-center mb-3 mt-4">
          <hr className="flex-grow border-gray-600" />
        </div>
        <div className="flex flex-col justify-center items-center text-sm">
          <a href="/auth" className="text-gray-100 font-semibold">
            <span className='text-gray-400 font-normal text-center'>Don't have an account?</span> Create Account
          </a>
          <a href="/forgotpass" className="text-gray-200 font-semibold">Forgot Password ?</a>
        </div>
      </div>

      {modalOpen && (
        <CustomModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />
      )}
    </div>
  );
};

export default Login;
