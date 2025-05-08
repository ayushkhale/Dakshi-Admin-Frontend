import React, { useState } from "react";
import axios from "axios";
import CustomModal from "../../Components/CustomModal";
import networkconfig from "../../Dynamics/networkconfig";

const SlipGenerator = () => {
  const [form, setForm] = useState({
    ADVANCE_DEPOSITE: "",
    MOBILE: "",
    INVOICE_DATE: "",
    DUE_DATE: "",
    COM_NAME: "",
    GSTIN: "",
    PHONE: "",
    EMAIL: "",
    BILLING_ADD: "",
    ITEM_1: "",
    ITEM_2: "",
    ITEM_3: "",
    ITEM_4: "",
    ITEM_1_RATE: "",
    ITEM_2_RATE: "",
    ITEM_3_RATE: "",
    ITEM_4_RATE: "",
    ITEM_1_QTY: "",
    ITEM_2_QTY: "",
    ITEM_3_QTY: "",
    ITEM_4_QTY: "",
  });

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      ADVANCE_DEPOSITE: Number(form.ADVANCE_DEPOSITE),
      MOBILE: form.MOBILE,
      INVOICE_DATE: form.INVOICE_DATE,
      DUE_DATE: form.DUE_DATE,
      COM_NAME: form.COM_NAME,
      GSTIN: form.GSTIN,
      PHONE: form.PHONE,
      EMAIL: form.EMAIL,
      BILLING_ADD: form.BILLING_ADD,
      ITEM_1: form.ITEM_1,
      ITEM_2: form.ITEM_2,
      ITEM_3: form.ITEM_3,
      ITEM_4: form.ITEM_4,
      ITEM_1_RATE: form.ITEM_1_RATE,
      ITEM_2_RATE: form.ITEM_2_RATE,
      ITEM_3_RATE: form.ITEM_3_RATE,
      ITEM_4_RATE: form.ITEM_4_RATE,
      ITEM_1_QTY: form.ITEM_1_QTY,
      ITEM_2_QTY: form.ITEM_2_QTY,
      ITEM_3_QTY: form.ITEM_3_QTY,
      ITEM_4_QTY: form.ITEM_4_QTY
    };
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${networkconfig.BASE_URL}/admin/generate/v1/invoice`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(form);
  
      if (response.data.success && response.data.redirect_url) {
        window.open(response.data.redirect_url, "_blank");
  
        setModalTitle("Slip Generated");
        setModalMessage("Invoice slip has been successfully generated.");
        setModalType("success");

        setForm({
          ADVANCE_DEPOSITE: "",
          MOBILE: "",
          INVOICE_DATE: "",
          DUE_DATE: "",
          COM_NAME: "",
          GSTIN: "",
          PHONE: "",
          EMAIL: "",
          BILLING_ADD: "",
          ITEM_1: "",
          ITEM_2: "",
          ITEM_3: "",
          ITEM_4: "",
          ITEM_1_RATE: "",
          ITEM_2_RATE: "",
          ITEM_3_RATE: "",
          ITEM_4_RATE: "",
          ITEM_1_QTY: "",
          ITEM_2_QTY: "",
          ITEM_3_QTY: "",
          ITEM_4_QTY: "",
        });
      } else {
        setModalTitle("Failed");
        setModalMessage(response.data.message || "Something went wrong.");
        setModalType("error");
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(
        error.response?.data?.message || "Slip generation failed. Try again."
      );
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
        className="bg-[#1f2937] text-white p-8 rounded-xl w-full max-w-6xl space-y-8 shadow-2xl"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-6">
          Invoice Slip Generator
        </h2>

        <div>
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Invoice Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium">Invoice Date</label>
              <input
                type="date"
                name="INVOICE_DATE"
                value={form.INVOICE_DATE}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Due Date</label>
              <input
                type="date"
                name="DUE_DATE"
                value={form.DUE_DATE}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Advance Deposite</label>
              <input
                type="number"
                name="ADVANCE_DEPOSITE"
                value={form.ADVANCE_DEPOSITE}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["COM_NAME", "Customer Name"],
              ["MOBILE", "Dakshi's Mobile No."],
              ["PHONE", "Phone Number"],
              ["EMAIL", "Email Address"],
              ["GSTIN", "GSTIN Number"],
            ].map(([name, placeholder]) => (
              <div key={name}>
                <label className="block mb-1 text-sm font-medium">{placeholder}</label>
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">Billing Address</label>
            <textarea
              name="BILLING_ADD"
              value={form.BILLING_ADD}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-600"
              placeholder="Enter Billing Address"
              required
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Item Details
          </h3>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-1 text-sm font-medium">Item {i} Name</label>
                <input
                  type="text"
                  name={`ITEM_${i}`}
                  value={form[`ITEM_${i}`]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Item {i} Rate</label>
                <input
                  type="number"
                  name={`ITEM_${i}_RATE`}
                  value={form[`ITEM_${i}_RATE`]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Item {i} Quantity</label>
                <input
                  type="number"
                  name={`ITEM_${i}_QTY`}
                  value={form[`ITEM_${i}_QTY`]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold text-lg"
        >
          {loading ? "Generating..." : "Generate Slip"}
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

export default SlipGenerator;
