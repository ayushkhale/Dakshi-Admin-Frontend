import React, { useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const AddEvent = () => {
  const [form, setForm] = useState({
    title: "",
    purpose: "",
    description: "",
    location: "",
    event_date: "",
    add_by: "",
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages({ ...images, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      Object.entries(images).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await axios.post(
        `${networkconfig.BASE_URL}admin/add-event`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setModalTitle("Event Added");
        setModalMessage("Event has been successfully added.");
        setModalType("success");
        setForm({
          title: "",
          purpose: "",
          description: "",
          location: "",
          event_date: "",
          add_by: "",
        });
        setImages({
          image1: null,
          image2: null,
          image3: null,
          image4: null,
        });
      } else {
        setModalTitle("Failed");
        setModalMessage(response.data.message || "Something went wrong.");
        setModalType("error");
      }
    } catch (error) {
      console.log(error)
      setModalTitle("Error");
      setModalMessage("Could not add the event. Try again later.");
      setModalType("error");
    } finally {
      setLoading(false);
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f2937] text-white p-8 rounded-xl w-full max-w-4xl space-y-6 shadow-2xl"
      >
        <h2 className="text-3xl font-semibold text-center mb-4">Add New Event</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Purpose</label>
            <input
              type="text"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Event Date</label>
            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Added By</label>
            <input
              type="text"
              name="add_by"
              value={form.add_by}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          {[1, 2, 3, 4].map((num) => (
            <div key={num}>
              <label className="block mb-1 text-sm">{`Image ${num}`}</label>
              <input
                type="file"
                name={`image${num}`}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 
             file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
             file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
             hover:file:bg-blue-700"
                required={num === 1}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-1 text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-600"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          {loading ? "Adding Event..." : "Add Event"}
        </button>
      </form>

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

export default AddEvent;
