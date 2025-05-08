import React, { useState } from "react";
import axios from "axios";
import networkconfig from "../../Dynamics/networkconfig";
import CustomModal from "../../Components/CustomModal";

const Certificate = () => {
  const [name, setName] = useState("");
  const [virtue, setVirtue] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

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
          setModalMessage("Unexpected error occurred, please try again later.");
          break;
        case 401:
          setModalTitle("Unauthorized");
          setModalMessage("Please log in.");
          break;
        case 403:
          setModalTitle("Access Denied");
          setModalMessage("You don't have permission.");
          break;
        case 404:
          setModalTitle("Not Found");
          setModalMessage("No data found.");
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

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/generate/v1/certificate`,
        { NAME: name, VIRTUE: virtue },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          mode: "cors",
          maxRedirects: 0,
        }
      );

      const { success, redirect_url } = response.data;
      if (success === true && redirect_url) {
        const openLinkInNewTab = (url) => {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        openLinkInNewTab(redirect_url);
        setModalTitle("Generation Succeeded");
        setModalMessage("Download & save your certificate.");
        setModalType("success");
        setModalOpen(true);
        setCertificateGenerated(true);
        setPdfUrl(redirect_url);
      }

    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
      setName("");
      setVirtue("");
    }
  };

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10 flex items-center justify-center">
      {!certificateGenerated ? (
        <form
          onSubmit={handleGenerateCertificate}
          className="bg-[#1f2937] text-white w-full max-w-lg p-8 rounded-xl shadow-lg border border-gray-600"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">Create Certificate</h2>

          <div className="mb-5">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <input
              type="text"
              name="virtue"
              placeholder="Enter Virtue"
              value={virtue}
              onChange={(e) => setVirtue(e.target.value)}
              className="w-full p-4 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition duration-300"
          >
            {loading ? "Generating..." : "Generate Certificate"}
          </button>
        </form>
      ) : (
        <div className="text-white w-full max-w-4xl text-center">
          <h3 className="text-3xl font-semibold mb-6">Your Certificate:</h3>

          <div className="bg-white rounded-lg shadow-md p-4">
            <iframe
              src={pdfUrl}
              title="Certificate Preview"
              className="w-full h-[500px] border border-gray-400 rounded-md"
            />
          </div>

          <button
            onClick={() => setCertificateGenerated(false)}
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300"
          >
            Generate Another Certificate
          </button>
        </div>
      )}

      {error && <p className="text-red-400 mt-4">{error}</p>}

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

export default Certificate;
