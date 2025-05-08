import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const generateCards = [
    { src: "https://i.ibb.co/GQYyrTnF/Certificate.png", label: "Generate Certificate", path: "/certificate" },
    { src: "https://i.ibb.co/YGFbGBR/IDcard.png", label: "Generate ID Card", path: "/generate-id" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/folder-project-management-7220449-5888930.png", label: "Generate Offer Letter", path: "/offer-letter" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/tax-6352284-5230861.png", label: "Generate Slips", path: "/slip" },
  ];

  const updateCards = [
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/9-date-calendar-8048258-6478672.png", label: "Update Events", path: "/addevents" },
    { src: "https://static.vecteezy.com/system/resources/previews/013/361/136/original/life-insurance-3d-icon-suitable-to-be-used-as-an-additional-element-in-the-design-of-templates-insurance-posters-and-banners-finance-png.png", label: "Update Team Members", path: "/team" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/oportunidad-8707707-7049613.png", label: "Update Partners Info", path: "/partners" },
    { src: "https://static.vecteezy.com/system/resources/previews/010/337/234/original/gallery-illustration-3d-png.png", label: "Update Gallery", path: "/addprograms" },
  ];

  const responseCards = [
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/job-security-3d-icon-download-in-png-blend-fbx-gltf-file-formats--employee-insurance-protection-secure-pack-crime-icons-6267284.png", label: "Internship Responses", path: "/InternshipForm" },
    { src: "https://static.vecteezy.com/system/resources/previews/019/858/023/non_2x/contact-illustration-3d-free-png.png", label: "Contact Responses", path: "/ContactForm" },
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
    <div className="bg-gray-900 px-4 md:px-10 py-10 min-h-[80vh] rounded-b-lg">
      {renderSection("Generate", generateCards)}
      {renderSection("Update", updateCards)}
      {renderSection("Responses", responseCards)}
    </div>
  );
};

export default Dashboard;
