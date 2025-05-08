import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig"; // Ensure this exports BASE_URL

const ContactForm = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${networkconfig.BASE_URL}/admin/get-all-contact-form`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log(response)

        if (response.data.success) {
          const msgs = response.data.messages;
          setMessages(msgs);
          setFilteredMessages(msgs);
        } else {
          setModalTitle("Failed");
          setModalMessage(response.data.message || "Unable to fetch messages.");
          setModalType("error");
          setModalOpen(true);
        }
      } catch (err) {
        console.log(err)
        console.error(err);
        setModalTitle("Error");
        setModalMessage("An error occurred while fetching contact messages.");
        setModalType("error");
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const filtered = messages.filter((msg) =>
      [msg.name, msg.email, msg.subject, msg.message]
        .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10">
      <h2 className="text-3xl font-semibold text-center text-white mb-6">Contact Messages</h2>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by name, email, subject, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p className="text-white text-center">Loading messages...</p>
      ) : filteredMessages.length === 0 ? (
        <p className="text-white text-center">No matching messages found.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className="bg-[#1f2937] text-white p-6 rounded-xl shadow-lg border border-gray-600"
            >
              <div className="mb-2"><strong>Name:</strong> {msg.name}</div>
              <div className="mb-2"><strong>Email:</strong> {msg.email}</div>
              <div className="mb-2"><strong>Subject:</strong> {msg.subject}</div>
              <div className="mb-2"><strong>Message:</strong> {msg.message}</div>
              <div className="text-sm text-gray-400">
                Received on: {new Date(msg.received_at).toLocaleString()}
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

export default ContactForm;
