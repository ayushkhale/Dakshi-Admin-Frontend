import React, { useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const Team = () => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("description", form.description);
    if (form.image) {
      formData.append("team_member_image", form.image);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/add-team-members`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setModalTitle("Team Member Added");
        setModalMessage("The team member has been added successfully.");
        setModalType("success");

        setForm({
          name: "",
          role: "",
          description: "",
          image: null,
        });

        // Reset file input manually
        document.getElementById("image-input").value = null;
      } else {
        setModalTitle("Failed");
        setModalMessage(response.data.message || "Something went wrong.");
        setModalType("error");
      }
    } catch (error) {
      console.log(error)
      setModalTitle("Error");
      setModalMessage("Failed to add team member.");
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
        className="bg-[#1f2937] text-white p-8 rounded-xl w-full max-w-3xl space-y-6 shadow-2xl"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-semibold text-center mb-4">Add Team Member</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Role</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Image File</label>
          <input
            type="file"
            name="image"
            id="image-input"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          {loading ? "Adding..." : "Add Member"}
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

export default Team;
