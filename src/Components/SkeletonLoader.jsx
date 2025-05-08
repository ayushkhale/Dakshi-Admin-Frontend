import React from "react";

const SkeletonDashboard = () => {
  return (
    <div className="flex w-full min-h-screen bg-[#0f172a] text-white">

      {/* Main Content */}
      <div className="flex-1 p-8">
        {["Generate", "Update", "Responses"].map((section, idx) => (
          <div key={idx} className="mb-10">
            <div className="w-40 h-6 skeleton mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1e293b] p-6 rounded-xl text-center shadow-md"
                >
                  <div className="w-16 h-16 mx-auto mb-4 skeleton rounded-md"></div>
                  <div className="w-24 h-4 skeleton mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonDashboard;

const style = document.createElement("style");
style.innerHTML = `
  .skeleton {
    background: linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(style);
