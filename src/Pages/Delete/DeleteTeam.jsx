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
        headers: { Authorization: `Bearer ${token}` },
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setModalTitle("Member Deleted");
        setModalMessage("Team member has been successfully deleted.");
        setModalType("success");
        setTeamData((prev) => prev.filter((member) => member.id !== selectedMember.id));
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
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-40 object-cover rounded-md mb-3 border border-gray-700"
            />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-11/12 max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-white">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-bold text-red-400">{selectedMember.name}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setSelectedMember(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteTeam;
