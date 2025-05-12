import { useEffect, useState } from "react";
import axios from "axios";
import networkconfig from "../Dynamics/networkconfig";
import CustomModal from "./CustomModal";

const Editprofile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    location: "",
    about: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const handleApiError = (error) => {
    if (!error.response) {
      setModalTitle("Network Error");
      setModalMessage("Check your internet connection.");
    } else {
      const { status } = error.response;
      switch (status) {
        case 400:
          setModalTitle("Bad Request");
          setModalMessage("Invalid input.");
          break;
        case 401:
          setModalTitle("Unauthorized");
          setModalMessage("Please login again.");
          break;
        case 403:
          setModalTitle("Forbidden");
          setModalMessage("You don't have access.");
          break;
        case 404:
          setModalTitle("Not Found");
          setModalMessage("Profile not found.");
          break;
        case 500:
          setModalTitle("Server Error");
          setModalMessage("Something went wrong.");
          break;
        default:
          setModalTitle("Error");
          setModalMessage("Unexpected error occurred.");
      }
    }
    setModalType("error");
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setModalTitle("Unauthorized");
          setModalMessage("Please log in.");
          setModalType("error");
          setModalOpen(true);
          return;
        }

        const response = await axios.get(`${networkconfig.BASE_URL}/admin/get-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = response.data.profile;
        setFormData({
          fullName: profile.fullName || "",
          jobTitle: profile.jobTitle || "",
          location: profile.location || "",
          about: profile.about || "",
          image: null,
        });

        if (profile.image) {
          setImagePreview(profile.image);
        }
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (formData.image) {
      const objectUrl = URL.createObjectURL(formData.image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setModalTitle("Unauthorized");
      setModalMessage("Please log in.");
      setModalType("error");
      setModalOpen(true);
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("jobTitle", formData.jobTitle);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("about", formData.about);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setModalTitle("Success");
      setModalMessage("Profile updated successfully.");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 px-4">
              <div className="border-2 border-gray-600 h-full flex items-center justify-center bg-gray-900 rounded-lg">
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-gray-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-full border-2 border-gray-700"
                    />
                  ) : (
                    <>
                      <span className="text-sm font-medium">
                        UPLOAD IMAGE HERE
                      </span>
                      <pre className="text-xs text-red-400">
                        Square Image of ratio 1:1
                      </pre>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="md:w-2/3 space-y-6">
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 h-28 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-2 rounded font-semibold"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <CustomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default Editprofile;
