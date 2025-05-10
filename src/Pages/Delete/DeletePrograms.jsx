import React, { useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const DeletePrograms = () => {
  const [selectedField, setSelectedField] = useState("EDU");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  // Confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const fetchImages = async () => {
    if (!selectedField) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${networkconfig.BASE_URL}/program-images`,
        { program_field: selectedField },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setImages(response.data.data || []);
      } else {
        setImages([]);
        setModalTitle("Failed");
        setModalMessage(response.data.message || "No images found.");
        setModalType("error");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setModalTitle("Error");
      setModalMessage("Something went wrong while fetching images.");
      setModalType("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (image_id, program_field) => {
    setImageToDelete({ image_id, program_field });
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    const { image_id, program_field } = imageToDelete;
    setDeletingId(image_id);
    setShowConfirm(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/delete/program-image`,
        { id: image_id, program_field },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setImages(images.filter(img => img.image_id !== image_id));
        setModalTitle("Deleted");
        setModalMessage("Image has been successfully deleted.");
        setModalType("success");
      } else {
        setModalTitle("Failed");
        setModalMessage(response.data.message || "Could not delete the image.");
        setModalType("error");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setModalTitle("Error");
      setModalMessage("Something went wrong while deleting the image.");
      setModalType("error");
    } finally {
      setDeletingId(null);
      setModalOpen(true);
      setImageToDelete(null);
    }
  };

  return (
    <div className="bg-[#111827] min-h-screen px-4 py-10 text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">Delete Programs</h2>

      <div className="max-w-md mx-auto mb-6">
        <label className="block mb-2 font-medium text-gray-300">Select Program Field:</label>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
        >
          <option value="EDU">Education</option>
          <option value="HLT">Healthcare</option>
          <option value="SST">Sustainable Development</option>
          <option value="RAD">Rural Development</option>
        </select>

        <button
          onClick={fetchImages}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
        >
          {loading ? "Fetching..." : "Fetch Images"}
        </button>
      </div>

      {images.length === 0 && !loading && (
        <p className="text-center text-gray-400">No images found for this field.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {images.map((img) => (
          <div
            key={img._id}
            className="bg-[#1f2937] p-4 rounded-lg shadow-md border border-gray-700"
          >
            <img
              src={img.image_url}
              alt={`Program ${img.program_fields}`}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <p className="text-sm text-gray-400 mb-1">
              <strong>Program:</strong> {img.program_fields}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              <strong>Added by:</strong> {img.added_by}
            </p>
            <button
              onClick={() => confirmDelete(img.image_id, img.program_fields)}
              disabled={deletingId === img.image_id}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
            >
              {deletingId === img.image_id ? "Deleting..." : "Delete"}
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

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-11/12 max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-white">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this program image?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
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

export default DeletePrograms;
