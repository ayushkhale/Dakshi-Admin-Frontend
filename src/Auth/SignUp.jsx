import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CustomModal from '../Components/CustomModal';
import networkconfig from '../Dynamics/networkconfig';

const SignUp = () => {
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) navigate('/dashboard'); 
  }, [navigate]);

  const location = useLocation();
  const email = location.state?.email || ''; 

  useEffect(() => {
    if (email) {
      axios.post( `${networkconfig.BASE_URL}/v1/send-otp `, { email })
        .then(response => {
          setSuccess('OTP has been sent to your email address.');
        })
        .catch(err => {
          setError('Failed to send OTP. Please try again.');
          setError(' ');
        });
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const handleApiError = (error) => {
      if (!error.response) {
        setModalTitle("Network Error");
        setModalMessage("Check your internet connection.");
      } else {
        const { status } = error.response;
        switch (status) {
          case 400:
            setModalTitle("Bad Request");
            setModalMessage("Invalid credentials or OTP Expired.");
            setTimeout(() => {
              navigate('/login');
            }, 3000);
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

    try {
      const response = await axios.post(
        `${networkconfig.BASE_URL}/v1/sign-up/verification`,
        { email, otp, username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setModalTitle("OTP Verification Succeed");
        setModalMessage("Account Created Successfully!!");
        setModalType("success");
        setModalOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setModalTitle("OTP Verification Failed");
        setModalMessage("Please Try Again!!");
        setModalType("error");
        setModalOpen(true);
        setTimeout(() => {
          navigate('/signup');
        }, 2000);
      }
    } catch (err) {
      handleApiError(err);
    }
    setTimeout(() => {
      setError('')
      setMessage('')
    }, 4000);
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative m-10 bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg w-11/12 sm:w-96 outline-dashed outline-gray-400">
        <div className="flex justify-center mb-3">
          <img  src="https://i.ibb.co/fVmN4CbS/20250426-152325.png" alt="Teacher Profile" className="w-28 mb-5" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* OTP verification message */}
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-green-400  mb-3">
              We have sent an OTP to <strong>{email}</strong>. Please enter it below to verify your email.
            </p>
            <p className="text-sm font-regular text-red-400 underline">
              <a href="/auth">
                Not your email address?
              </a>
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-600 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-600 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-600 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-600 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-600 text-white font-semibold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {loading ? "Creating Account..." : "Verify OTP & Sign-Up "}
          </button>
        </form>
          

        <div className="flex items-center mb-3 mt-4">
          <hr className="flex-grow border-gray-500" />
        </div>

        <div className="flex justify-center text-sm">
          <a href="/login" className="text-gray-100 font-bold">
            <span className="text-gray-500 font-normal">Already have an account?</span> Login
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

export default SignUp;
