import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const DeleteTeam = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${networkconfig.BASE_URL}/get-team-members`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTeamData(response.data.data || []);
      } else {
        setModalTitle("Fetch Failed");
        setModalMessage(response.data.message || "Failed to fetch team members.");
        setModalType("error");
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setModalTitle("Error");
      setModalMessage("Failed to load team data.");
      setModalType("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (member) => {
    setSelectedMember(member);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/delete/team-member`,
        { id: selectedMember.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setModalTitle("Member Deleted");
        setModalMessage("Team member has been successfully deleted.");
        setModalType("success");
        setTeamData(prev => prev.filter(member => member.id !== selectedMember.id));
      } else {
        setModalTitle("Delete Failed");
        setModalMessage(response.data.message || "Could not delete the member.");
        setModalType("error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setModalTitle("Error");
      setModalMessage("An error occurred while deleting the team member.");
      setModalType("error");
    } finally {
      setLoading(false);
      setModalOpen(true);
      setConfirmOpen(false);
      setSelectedMember(null);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Delete Team Members</h2>

      {loading && <p className="text-center text-gray-400">Loading...</p>}

      {!loading && teamData.length === 0 && (
        <p className="text-center text-gray-400">No team members found.</p>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {teamData.map((member) => (
          <div key={member._id} className="bg-[#1f2937] p-4 rounded-lg shadow-md w-64">
            <img src={member.image} alt={member.name} className="w-full h-40 object-cover rounded-md mb-3 border border-gray-700" />
            <h3 className="text-lg font-bold">{member.name}</h3>
            <p className="text-sm text-gray-400 mb-1">{member.role}</p>
            <p className="text-sm text-gray-400 mb-3">{member.description}</p>
            <button
              onClick={() => confirmDelete(member)}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full"
            >
              Delete
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

      {confirmOpen && selectedMember && (
        <CustomModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Confirm Delete"
          message={`Are you sure you want to delete "${selectedMember.name}"?`}
          type="warning"
          onConfirm={handleDelete}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default DeleteTeam;
