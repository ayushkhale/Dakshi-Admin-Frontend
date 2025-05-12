import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllOffer = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOfferLetters = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://demo.dakshifoundation.in/admin/all-offerletters', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOfferLetters(response.data.data);
    } catch (err) {
      console.error('Error fetching offer letters:', err);
      setError('Failed to fetch offer letters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferLetters();
  }, []);

  if (loading) return <div className="text-center text-white h-[100vh]">Loading offer letters...</div>;
  if (error) return <div className="text-center text-red-500 h-[100vh]">{error}</div>;
  if (offerLetters.length === 0) return <div className="text-center text-gray-400 h-[100vh]">No offer letters found.</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-6">All Generated Offer Letters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerLetters.map((letter, index) => (
          letter.offerLetterUrl && (
            <div
              key={letter._id || index}
              className="bg-gray-800 p-4 rounded shadow-lg flex flex-col items-center"
            >
              <iframe
                src={letter.offerLetterUrl}
                title={`OfferLetter-${index}`}
                width="100%"
                height="400px"
                className="rounded border"
              />
              <a
                href={letter.offerLetterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-400 underline"
              >
                Open Full View
              </a>
              <a
                href={letter.offerLetterUrl}
                download
                className="mt-1 text-green-400 underline"
              >
                Download PDF
              </a>
              <p className="mt-2 text-sm text-gray-400">
                Issued to <span className="text-white font-semibold">{letter.Name}</span> by <span className="text-white font-semibold">{letter.issued_by}</span>
              </p>
              <p className="text-xs text-gray-500">
                Job Title: {letter.jobTitle} | ID: {letter.offerLetterId}
              </p>
              <p className="text-xs text-gray-500">
                Joining Date: {new Date(letter.joiningDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                Salary: ₹{(letter.salary).toLocaleString()}
              </p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AllOffer;
