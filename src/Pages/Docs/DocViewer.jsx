import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const generateCards = [
    { src: "https://i.ibb.co/GQYyrTnF/Certificate.png", label: "Certificates", path: "/all-certificate" },
    { src: "https://i.ibb.co/YGFbGBR/IDcard.png", label: "ID Cards", path: "/all-IdCards" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/folder-project-management-7220449-5888930.png", label: "Offer Letters", path: "/all-offer-letter" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/tax-6352284-5230861.png", label: "Slips", path: "/all-Invoices" },
  ];

  const renderSection = (title, cards) => (
    <>
      <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">{title}</h2>
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="h-[200px] w-[280px] bg-gray-800 border border-gray-700 p-4 rounded-lg flex flex-col items-center justify-center hover:scale-95 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={card.src}
              alt={`${card.label} Icon`}
              className="mb-3 w-[80px] h-[80px] object-contain"
            />
            <span className="text-lg text-center font-medium text-gray-100">
              {card.label}
            </span>
          </div>
        ))}
      </section>
    </>
  );

  return (
    <div className="bg-gray-900 px-4 md:px-10 py-10 min-h-[100vh] rounded-b-lg">
      {renderSection("Documents", generateCards)}
    </div>
  );
};

export default Dashboard;
