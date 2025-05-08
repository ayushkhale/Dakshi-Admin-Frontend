import React, { useState, useEffect } from "react";
import networkconfig from "../Dynamics/networkconfig";
import CustomModal from "./CustomModal";

const ProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setModalTitle("Unauthorized");
          setModalMessage("Please Log In");
          setModalType("error");
          setModalOpen(true);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${networkconfig.BASE_URL}/admin/get-profile`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.message || "Failed to fetch profile data";
          throw new Error(errorMessage);
        }

        setProfileData(data.profile);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md flex flex-col items-center p-6 border border-gray-700">
        <img
          src={
            profileData?.image ||
            "https://cdn3.iconfinder.com/data/icons/avatars-collection/256/22-512.png"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-600"
        />
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-100">
            {profileData?.fullName}
          </h2>
          <p className="text-gray-400 text-sm">@{profileData?._id || "N/A"}</p>
          <p className="text-gray-300 mt-2 text-sm">
            {profileData?.about || "No bio available"}
          </p>
        </div>
        <div className="border-t border-gray-600 w-full mt-4 pt-4 text-center">
          <p className="font-semibold text-lg text-gray-100">
            {profileData?.jobTitle}
          </p>
          <p className="text-gray-400 text-sm">{profileData?.location}</p>
        </div>
      </div>

      <CustomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};

export default ProfileCard;
