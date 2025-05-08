import React, { useState, useEffect } from "react";
import networkconfig from "../Dynamics/networkconfig";
import CustomModal from "./CustomModal";

const ProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(data);

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-5 bg-white md:p-0">
      <div className="bg-white rounded-lg w-full max-w-xs flex md:mx-5 my-10 md:my-0 flex-col items-center p-5 h-fit outline-dashed outline-1 outline-gray-400">
        <img
          src={profileData?.image || "https://cdn3.iconfinder.com/data/icons/avatars-collection/256/22-512.png"}
          alt="Profile picture"
          className="w-24 h-24 md:h-32 md:w-32 rounded-full outline-dashed outline-gray-400 object-cover"
          />
        <div className="p-2 text-center">
          <h2 className="text-lg md:text-xl font-bold">{profileData?.fullName}</h2>
          <p className="text-gray-600 text-sm">@{ profileData?._id || "N/A"}</p>
          <p className="text-gray-700 mt-2 text-sm md:text-base">
            {profileData?.about || "No bio available"}
          </p>
        </div>
        <div className="border-t border-gray-300 w-full">
          <div className="p-2 text-center">
            <p className="font-bold text-lg">{profileData?.jobTitle}</p>
            <p className="text-gray-600 text-sm">{profileData?.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;