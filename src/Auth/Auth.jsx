import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomModal from '../Components/CustomModal';
import networkconfig from '../Dynamics/networkconfig';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
          setModalMessage("Email already exists Or Unauthorized Email Domain.");
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
    setLoading(true);
    try {
      const response = await axios.post(
        `${networkconfig.BASE_URL}/v1/sign-up`,
        { email },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setModalTitle("Email Sent Successfully !!");
        setModalMessage("We have sent an OTP to " + email);
        setModalType("success");
        setModalOpen(true);

        setTimeout(() => {
          navigate('/signup', { state: { email } });
        }, 4000);
      }
    } catch (err) {
      handleApiError(err);
    }
    setTimeout(() => {
      setError('');
    }, 3500);
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#111827]">
      <div className="relative m-10 bg-[#1f2937] p-4 sm:p-6 shadow-xl w-11/12 sm:w-96 outline outline-1 outline-gray-600 rounded-md">
        <div className="flex justify-center mb-4">
          <img src="https://i.ibb.co/fVmN4CbS/20250426-152325.png" alt="Teacher Profile" className="w-28 mb-2" />
        </div>
        {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-3 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-800 text-gray-200 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {loading ? "Progressing..." : "Continue"}
          </button>
        </form>
        <div className="flex items-center mb-3 mt-4">
          <hr className="flex-grow border-gray-700" />
          <hr className="flex-grow border-gray-700" />
        </div>
        <div className="flex justify-center text-sm p-2">
          <a href="/login" className="text-gray-100 font-semibold">
            <span className="text-gray-400 font-normal">Already a User?</span> Log in
          </a>
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

export default Auth;
