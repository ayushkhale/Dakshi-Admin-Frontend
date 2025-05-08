import React from 'react'
const Cards = () => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
                { src: "public/Certificate.png", label: "Generate Certificate" },
                { src: "public/IDcard.png", label: "Generate ID" },
                { src: "public/Offerletter.png", label: "Create Offer Letter" },
            ].map((card, index) => (
                <div 
                    key={index} 
                    className="h-[200px] bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                    <img 
                        src={card.src} 
                        alt={`${card.label} Icon`}
                        className="mb-4 w-full max-w-[100px] object-contain" 
                    />
                    <span className="text-lg font-semibold">{card.label}</span>
                </div>
            ))}
        </section>
    )
}
export default Cards
