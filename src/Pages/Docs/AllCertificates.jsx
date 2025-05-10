import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCertificates = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://demo.dakshifoundation.in/admin/delete/all-certificates', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setCertificates(response.data);
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

  if (loading) return <div className="text-center text-white">Loading certificates...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (certificates.length === 0) return <div className="text-center text-gray-400">No certificates found.</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-6">All Generated Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert, index) => (
          cert.certificateUrl && (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded shadow-lg flex flex-col items-center"
            >
              <iframe
                src={cert.certificateUrl}
                title={`Certificate ${index}`}
                width="100%"
                height="400px"
                className="rounded border"
              />
              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-400 underline"
              >
                Open Full View
              </a>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AllCertificates;
