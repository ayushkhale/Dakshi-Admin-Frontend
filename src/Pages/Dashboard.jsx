import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const generateCards = [
    { src: "https://i.ibb.co/GQYyrTnF/Certificate.png", label: "Generate Certificate", path: "/certificate" },
    { src: "https://i.ibb.co/YGFbGBR/IDcard.png", label: "Generate ID Card", path: "/generate-id" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/folder-project-management-7220449-5888930.png", label: "Generate Offer Letter", path: "/offer-letter" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/tax-6352284-5230861.png", label: "Generate Invoice", path: "/slip" },
  ];

  const updateCards = [
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/9-date-calendar-8048258-6478672.png", label: "Add Events", path: "/addevents" },
    { src: "https://static.vecteezy.com/system/resources/previews/013/361/136/original/life-insurance-3d-icon-suitable-to-be-used-as-an-additional-element-in-the-design-of-templates-insurance-posters-and-banners-finance-png.png", label: "Add Team Members", path: "/team" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/oportunidad-8707707-7049613.png", label: "Add Partners Info", path: "/partners" },
    { src: "https://static.vecteezy.com/system/resources/previews/010/337/234/original/gallery-illustration-3d-png.png", label: "Add Pictures", path: "/addprograms" },
  ];

  const DeleteCards = [
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/9-date-calendar-8048258-6478672.png", label: "Delete Events", path: "/delete-events" },
    { src: "https://static.vecteezy.com/system/resources/previews/013/361/136/original/life-insurance-3d-icon-suitable-to-be-used-as-an-additional-element-in-the-design-of-templates-insurance-posters-and-banners-finance-png.png", label: "Delete Team Members", path: "/delete-team" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/oportunidad-8707707-7049613.png", label: "Delete Partners Info", path: "/delete-partners" },
    { src: "https://static.vecteezy.com/system/resources/previews/010/337/234/original/gallery-illustration-3d-png.png", label: "Delete Pictures", path: "/delete-programs" },
  ];


  const DocCards = [
    { src: "https://i.ibb.co/GQYyrTnF/Certificate.png", label: "All certificates", path: "/all-certificate" },
    { src: "https://i.ibb.co/YGFbGBR/IDcard.png", label: "All ID Cards", path: "/all-IdCards" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/folder-project-management-7220449-5888930.png", label: "All Invoices", path: "/all-Invoices" },
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/tax-6352284-5230861.png", label: "All Offer Letters", path: "/all-offer-letter" },
    { src: "https://i.ibb.co/YGFbGBR/IDcard.png", label: "All ID Cards", path: "/all-events" },
  ];

  const responseCards = [
    { src: "https://cdn3d.iconscout.com/3d/premium/thumb/job-security-3d-icon-download-in-png-blend-fbx-gltf-file-formats--employee-insurance-protection-secure-pack-crime-icons-6267284.png", label: "Internship Responses", path: "/InternshipForm" },
    { src: "https://static.vecteezy.com/system/resources/previews/019/858/023/non_2x/contact-illustration-3d-free-png.png", label: "Contact Responses", path: "/ContactForm" },
  ];

  const renderSection = (title, cards) => (
    <div className="mb-10 w-full">
      <h2 className="text-xl sm:text-2xl text-white font-semibold mb-4">{title}</h2>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="w-full max-w-[300px] mx-auto bg-gray-800 border border-gray-700 p-5 rounded-lg flex flex-col items-center justify-center hover:scale-[0.97] transition-transform duration-300 cursor-pointer"
          >
            <img
              src={card.src}
              alt={`${card.label} Icon`}
              className={`mb-3 w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] object-contain ${title === 'Delete' ? 'filter grayscale' : ''}`}
            />
            <span className="text-base sm:text-lg text-center font-medium text-gray-100">
              {card.label}
            </span>
          </div>
        ))}
      </section>
    </div>
  );

  return (
    <div className="bg-gray-900 px-4 sm:px-6 md:px-10 py-10 min-h-screen rounded-b-lg">
      {renderSection("Generate", generateCards)}
      {renderSection("Add", updateCards)}
      {renderSection("Delete", DeleteCards)}
      {renderSection("Docs", DocCards)}
      {renderSection("Responses", responseCards)}
    </div>
  );
};

export default Dashboard;
