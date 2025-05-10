import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const DeleteEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${networkconfig.BASE_URL}/all-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleDelete = async (event_id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/delete/event`,
        { id: event_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setModalTitle("Event Deleted");
        setModalMessage("Event has been successfully deleted.");
        setModalType("success");
        setEvents((prev) => prev.filter((event) => event.event_id !== event_id));
      } else {
        setModalTitle("Failed");
        setModalMessage(response.data.message || "Could not delete the event.");
        setModalType("error");
      }
    } catch (error) {
      console.error(error);
      setModalTitle("Error");
      setModalMessage("An error occurred while deleting the event.");
      setModalType("error");
    } finally {
      setLoading(false);
      setModalOpen(true);
      setConfirmDeleteOpen(false);
      setSelectedEventId(null);
    }
  };

  const askDeleteConfirmation = (event_id) => {
    setSelectedEventId(event_id);
    setConfirmDeleteOpen(true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Delete Events</h2>

      {events.length === 0 && (
        <p className="text-center text-gray-400">No events found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-[#1f2937] p-4 rounded-lg shadow-md border border-gray-700"
          >
            <div className="flex space-x-2 mb-3">
              <img
                src={event.image1}
                alt="Image 1"
                className="w-1/2 h-32 object-cover rounded-md border"
              />
              <img
                src={event.image2}
                alt="Image 2"
                className="w-1/2 h-32 object-cover rounded-md border"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
            <p className="text-sm text-gray-400 mb-1">{event.purpose}</p>
            <p className="text-sm mb-2">{event.description}</p>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Date:</strong> {event.event_date}
            </p>

            <button
              onClick={() => askDeleteConfirmation(event.event_id)}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full"
            >
              {loading && selectedEventId === event.event_id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        ))}
      </div>

      {confirmDeleteOpen && (
        <CustomModal
          isOpen={confirmDeleteOpen}
          onClose={() => {
            setConfirmDeleteOpen(false);
            setSelectedEventId(null);
          }}
          title="Are you sure?"
          message="Do you really want to delete this event?"
          type="warning"
          onConfirm={() => handleDelete(selectedEventId)}
        />
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

export default DeleteEvents;
