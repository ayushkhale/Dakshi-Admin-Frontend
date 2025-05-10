import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const DeletePartner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${networkconfig.BASE_URL}/get-ngo-partner`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPartners(response.data.data || []);
      } else {
        setModalTitle("Fetch Failed");
        setModalMessage(response.data.message || "Failed to fetch partners.");
        setModalType("error");
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setModalTitle("Error");
      setModalMessage("Could not fetch partner data.");
      setModalType("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/delete/partner`,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setModalTitle("Partner Deleted");
        setModalMessage("NGO Partner has been successfully deleted.");
        setModalType("success");
        setPartners(prev => prev.filter(p => p.id !== id));
      } else {
        setModalTitle("Delete Failed");
        setModalMessage(response.data.message || "Could not delete the partner.");
        setModalType("error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setModalTitle("Error");
      setModalMessage("An error occurred while deleting the NGO partner.");
      setModalType("error");
    } finally {
      setLoading(false);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Delete NGO Partners</h2>

      {loading && <p className="text-center text-gray-400">Loading...</p>}

      {!loading && partners.length === 0 && (
        <p className="text-center text-gray-400">No NGO partners found.</p>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {partners.map((partner) => (
          <div key={partner._id} className="bg-[#1f2937] p-4 rounded-lg shadow-md w-72">
            <div className="flex space-x-2 mb-3">
              <img
                src={partner.person_image}
                alt={partner.name}
                className="w-1/2 h-32 object-cover rounded-md border border-gray-700"
              />
              <img
                src={partner.company_logo}
                alt="Company Logo"
                className="w-1/2 h-32 object-contain bg-white rounded-md border border-gray-700 p-1"
              />
            </div>
            <h3 className="text-lg font-bold">{partner.name}</h3>
            <p className="text-sm text-gray-400">{partner.description}</p>
            <p className="text-xs text-gray-500 mt-1">Contact: {partner.contactPerson}</p>
            <p className="text-xs text-gray-500">Email: {partner.email}</p>
            <button
              onClick={() => handleDelete(partner.id)}
              disabled={loading}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
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

export default DeletePartner;