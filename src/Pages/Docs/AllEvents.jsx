import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  field: {
    fontSize: 12,
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  image: {
    width: 240,
    height: 150,
    objectFit: "cover",
    borderRadius: 4,
  },
});

// Single event PDF component
const EventDocument = ({ event }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Event Details</Text>
      <View style={styles.section}>
        <Text style={styles.field}><Text style={{ fontWeight: 'bold' }}>Title:</Text> {event.title}</Text>
        <Text style={styles.field}><Text style={{ fontWeight: 'bold' }}>Purpose:</Text> {event.purpose}</Text>
        <Text style={styles.field}><Text style={{ fontWeight: 'bold' }}>Description:</Text> {event.description}</Text>
        <Text style={styles.field}><Text style={{ fontWeight: 'bold' }}>Location:</Text> {event.location}</Text>
        <Text style={styles.field}><Text style={{ fontWeight: 'bold' }}>Date:</Text> {event.event_date}</Text>
      </View>
      <View style={styles.imageRow}>
        {event.image1 && <Image src={event.image1} style={styles.image} />}
        {event.image2 && <Image src={event.image2} style={styles.image} />}
      </View>
    </Page>
  </Document>
);

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

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

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Export Individual Event PDFs</h2>

      {events.length === 0 && (
        <p className="text-center text-gray-400">No events found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {events.map((event, index) => (
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

            <div className="mt-4 text-center">
              <PDFDownloadLink
                document={<EventDocument event={event} />}
                fileName={`event_${event.title?.replace(/\s+/g, "_") || index}.pdf`}
              >
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md text-sm"
                  >
                    {loading ? "Preparing..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
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

export default AllEvents;
