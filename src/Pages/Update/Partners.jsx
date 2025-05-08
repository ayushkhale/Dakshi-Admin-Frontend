import React, { useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const Partners = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    contactPerson: "",
    email: "",
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, imageSetter) => {
    const file = e.target.files[0];
    imageSetter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("contactPerson", form.contactPerson);
    formData.append("email", form.email);

    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);

    try {
      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/add-ngo-partners`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setModalTitle("Partner Added");
        setModalMessage("New NGO Partner has been added successfully.");
        setModalType("success");

        setForm({
          name: "",
          description: "",
          contactPerson: "",
          email: "",
        });
        setImage1(null);
        setImage2(null);
      } else {
        setModalTitle("Failed");
        setModalMessage(response.data.message || "Something went wrong.");
        setModalType("error");
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to add partner.");
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
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-semibold text-center mb-4">Add NGO Partner</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm">Partner Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Company's Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setImage1)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 
             file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
             file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
             hover:file:bg-blue-700"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Partner's Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setImage2)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 
             file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
             file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
             hover:file:bg-blue-700"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          {loading ? "Adding..." : "Add Partner"}
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

export default Partners;
