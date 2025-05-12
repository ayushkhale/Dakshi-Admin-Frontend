import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCertificates = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://demo.dakshifoundation.in/admin/all-certificates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCertificates(response.data.data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  if (loading) return <div className="text-center text-white h-[100vh]">Loading certificates...</div>;
  if (error) return <div className="text-center text-red-500 h-[100vh]">{error}</div>;
  if (certificates.length === 0) return <div className="text-center text-gray-400 h-[100vh]">No certificates found.</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-6">All Generated Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          cert.certificate_url && (
            <div
              key={cert._id || index}
              className="bg-gray-800 p-4 rounded shadow-lg flex flex-col items-center"
            >
              <iframe
                src={cert.certificate_url}
                title={`Certificate-${index}`}
                width="100%"
                height="400px"
                className="rounded border"
              />
              <a
                href={cert.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-400 underline"
              >
                Open Full View
              </a>
              <a
                href={cert.certificate_url}
                download
                className="mt-1 text-green-400 underline"
              >
                Download PDF
              </a>
              <p className="mt-2 text-sm text-gray-400">
                Issued to <span className="text-white font-semibold">{cert.name}</span> by <span className="text-white font-semibold">{cert.issued_by}</span>
              </p>
              <p className="text-xs text-gray-500">{new Date(cert.issue_date).toLocaleDateString()}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AllCertificates;
