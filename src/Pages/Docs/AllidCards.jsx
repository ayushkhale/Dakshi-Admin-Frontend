import React, { useEffect, useState } from 'react';
import axios from 'axios';
import networkconfig from '../../Dynamics/networkconfig';

const AllIdCards = () => {
  const [idCards, setIdCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIdCards = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${networkconfig.BASE_URL}/admin/all-idcards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIdCards(response.data.data);
    } catch (err) {
      console.error('Error fetching ID cards:', err);
      setError('Failed to fetch ID cards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdCards();
  }, []);

  if (loading) return <div className="text-center text-white h-[100vh]">Loading ID cards...</div>;
  if (error) return <div className="text-center text-red-500 h-[100vh]">{error}</div>;
  if (idCards.length === 0) return <div className="text-center text-gray-400 h-[100vh]">No ID cards found.</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-6">All Generated ID Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {idCards.map((card, index) => (
          card.Id_url && (
            <div
              key={card._id || index}
              className="bg-gray-800 p-4 rounded shadow-lg flex flex-col items-center"
            >
              <iframe
                src={card.Id_url}
                title={`IDCard-${index}`}
                width="100%"
                height="400px"
                className="rounded border"
              />
              <a
                href={card.Id_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-400 underline"
              >
                Open Full View
              </a>
              <a
                href={card.Id_url}
                download
                className="mt-1 text-green-400 underline"
              >
                Download PDF
              </a>
              <p className="mt-2 text-sm text-gray-400">
                Issued to <span className="text-white font-semibold">{card.NAME}</span> by <span className="text-white font-semibold">{card.issued_by}</span>
              </p>
              <p className="text-xs text-gray-500">
                Position: {card.POSITION} | ECODE: {card.ECODE}
              </p>
              <p className="text-xs text-gray-500">
                Valid: {new Date(card.DateOJ).toLocaleDateString()} - {new Date(card.DateOE).toLocaleDateString()}
              </p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AllIdCards;
