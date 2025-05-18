import React, { useEffect, useState } from 'react';
import axios from 'axios';
import networkconfig from '../../Dynamics/networkconfig';

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInvoices = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${networkconfig.BASE_URL}/admin/all-invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoices(response.data.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) return <div className="text-center text-white h-[100vh]">Loading invoices...</div>;
  if (error) return <div className="text-center text-red-500 h-[100vh]">{error}</div>;
  if (invoices.length === 0) return <div className="text-center text-gray-400 h-[100vh]">No invoices found.</div>;

  return (
    <div className="p-4 text-white ">
      <h2 className="text-2xl font-bold mb-6">All Generated Invoices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice, index) => (
          invoice.INVOICE_URL && (
            <div
              key={invoice._id || index}
              className="bg-gray-800 p-4 rounded shadow-lg flex flex-col items-center"
            >
              <iframe
                src={invoice.INVOICE_URL}
                title={`Invoice-${index}`}
                width="100%"
                height="400px"
                className="rounded border"
              />
              <a
                href={invoice.INVOICE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-400 underline"
              >
                Open Full View
              </a>
              <a
                href={invoice.INVOICE_URL}
                download
                className="mt-1 text-green-400 underline"
              >
                Download PDF
              </a>
              <p className="mt-2 text-sm text-gray-400">
                Issued to <span className="text-white font-semibold">{invoice.COM_NAME}</span>
              </p>
              {/* <p className="text-xs text-gray-500">Invoice ID: {invoice.INVOICE_ID}</p> */}
              <p className="text-xs text-gray-500">
                Date: {new Date(invoice.INVOICE_DATE).toLocaleDateString()} | Due: {new Date(invoice.DUE_DATE).toLocaleDateString()}
              </p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AllInvoices;
