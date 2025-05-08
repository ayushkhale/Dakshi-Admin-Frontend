import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

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
    if (formData.image) {
      const objectUrl = URL.createObjectURL(formData.image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Cleanup
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
    setError("");

    let formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("jobTitle", formData.jobTitle);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("about", formData.about);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

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
      const response = await fetch(`${networkconfig.BASE_URL}/admin/profile`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to upload data");
      }

      setModalTitle("Updated");
      setModalMessage("Profile Updated Successfully !!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false)
      setFormData({
        fullName: "",
        jobTitle: "",
        location: "",
        about: "",
        image: null,
      });
    }
  };

  return (
    <div className="container bg-white px-5 py-5 flex justify-center items-baseline md:h-[80vh] rounded-b-lg">
      <div className="bg-white w-full max-w-4xl">
        <h1 className="text-center text-2xl font-bold mb-6">EDIT PROFILE</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
              <div className="border-2 border-black h-full flex items-center justify-center">
                <label className="cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected" className="h-32 w-32 object-cover" />
                  ) : (
                    <>
                      <span>UPLOAD IMAGE HERE</span>
                      <pre className="text-xs text-red-700">Square Image of ratio 1:1</pre>
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="w-full md:w-2/3 px-4">
              <div className="bg-gray-200 p-4 border-2 border-black">
                <div className="mb-4">
                  <label className="block font-bold mb-1">FULL NAME</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border-b-2 border-black p-1"
                  />
                </div>
                <div className="flex flex-wrap -mx-2 mb-4">
                  <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                    <label className="block font-bold mb-1">JOB TITLE</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full border-b-2 border-black p-1"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block font-bold mb-1">LOCATION</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border-b-2 border-black p-1"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">ABOUT</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="w-full border-2 border-black p-2"
                  />
                </div>
                <div className="text-center w-full">
                  <button
                    type="submit"
                    className="w-full py-2 bg-gray-700 text-white font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
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

export default Editprofile;
