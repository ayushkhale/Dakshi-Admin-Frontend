import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const InternshipForm = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${networkconfig.BASE_URL}/admin/get-all-internships-registrations`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          setApplications(response.data.data);
          setFilteredApps(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch applications.");
        }
      } catch (error) {
        setModalTitle("Error");
        setModalMessage(error.message || "Something went wrong.");
        setModalType("error");
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const filtered = applications.filter((app) =>
      [app.full_name, app.email, app.phone_number, app.college_name, app.interest]
        .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredApps(filtered);
  }, [searchQuery, applications]);

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10">
      <h2 className="text-3xl font-semibold text-center text-white mb-6">
        Internship Applications
      </h2>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by name, email, interest, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p className="text-white text-center">Loading applications...</p>
      ) : filteredApps.length === 0 ? (
        <p className="text-white text-center">No matching applications found.</p>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="bg-[#1f2937] text-white p-6 rounded-xl shadow-lg border border-gray-600"
            >
              <div className="mb-2"><strong>Full Name:</strong> {app.full_name}</div>
              <div className="mb-2"><strong>Email:</strong> {app.email}</div>
              <div className="mb-2"><strong>Phone Number:</strong> {app.phone_number}</div>
              <div className="mb-2"><strong>College:</strong> {app.college_name}</div>
              <div className="mb-2"><strong>Degree:</strong> {app.degree}</div>
              <div className="mb-2"><strong>Branch:</strong> {app.branch}</div>
              <div className="mb-2"><strong>Year of Passing:</strong> {app.year_of_passing}</div>
              <div className="mb-2">
                <strong>Resume:</strong>{" "}
                <a
                  href={app.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  View Resume
                </a>
              </div>
              <div className="mb-2"><strong>Interest:</strong> {app.interest}</div>
              <div className="text-sm text-gray-400">
                Applied on: {new Date(app.applied_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

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

export default InternshipForm;
