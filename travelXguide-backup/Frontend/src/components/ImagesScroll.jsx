import React, { useState } from "react";
import img1 from "../assetss/daljheel.jpg";
import img2 from "../assetss/lotus.jpg";
import img3 from "../assetss/tajmahal.jpg";
import img4 from "../assetss/gateway.jpg";
import img5 from "../assetss/statueoU.jpg";
import img6 from "../assetss/redfort.jpg";
import img7 from "../assetss/qutubminar.jpg";
import img8 from "../assetss/tajhotel.jpg";
import img9 from "../assetss/Manali.jpg";
import img10 from "../assetss/RannOfKuch.jpg";

const topImages = [
  { url: img1, name: "Daljheel", location: "Srinagar, Jammu & Kashmir" },
  { url: img2, name: "Lotus Temple", location: "New Delhi" },
  { url: img3, name: "Taj Mahal", location: "Agra, Uttar Pradesh" },
  { url: img4, name: "Gateway of India", location: "Mumbai, Maharashtra" },
  { url: img5, name: "Statue Of Unity", location: "Kevadia, Gujarat" },
];

const bottomImages = [
  { url: img6, name: "Red Fort", location: "New Delhi" },
  { url: img7, name: "Qutub Minar", location: "New Delhi" },
  { url: img8, name: "Hotel Taj", location: "Mumbai, Maharashtra" },
  { url: img9, name: "Manali", location: "Himachal Pradesh" },
  { url: img10, name: "Rann Of Kutch", location: "Gujarat" },
];

const ImageScroll = () => {
  const [pauseTop, setPauseTop] = useState(false);
  const [pauseBottom, setPauseBottom] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full mb-4">
            Explore India
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Must-Visit <span className="text-blue-600">Destinations</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Discover the breathtaking beauty and rich heritage of India's most iconic locations
          </p>
        </div>

        {/* Top Scrolling Slider (Left to Right) */}
        <div
          className="relative overflow-hidden mb-12 group"
          onMouseEnter={() => setPauseTop(true)}
          onMouseLeave={() => setPauseTop(false)}
        >
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none"></div>
          
          <div
            className={`flex gap-8 animate-scroll-left ${pauseTop ? "paused" : ""}`}
          >
            {[...topImages, ...topImages].map((item, index) => (
              <div 
                key={`top-${index}`} 
                className="relative flex-shrink-0 w-80 md:w-96 transition-all duration-300 hover:scale-95"
                onMouseEnter={() => setHoveredItem(`top-${index}`)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl h-64 group">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 ${hoveredItem === `top-${index}` ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="text-2xl font-bold text-white">{item.name}</h3>
                    <p className="text-blue-200">{item.location}</p>
                    <button className="mt-3 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium w-fit hover:bg-blue-50 transition-colors">
                      Explore More
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{item.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Scrolling Slider (Right to Left) */}
        <div
          className="relative overflow-hidden group"
          onMouseEnter={() => setPauseBottom(true)}
          onMouseLeave={() => setPauseBottom(false)}
        >
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none"></div>
          
          <div
            className={`flex gap-8 animate-scroll-right ${pauseBottom ? "paused" : ""}`}
          >
            {[...bottomImages, ...bottomImages].map((item, index) => (
              <div 
                key={`bottom-${index}`} 
                className="relative flex-shrink-0 w-80 md:w-96 transition-all duration-300 hover:scale-95"
                onMouseEnter={() => setHoveredItem(`bottom-${index}`)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl h-64 group">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 ${hoveredItem === `bottom-${index}` ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="text-2xl font-bold text-white">{item.name}</h3>
                    <p className="text-blue-200">{item.location}</p>
                    <button className="mt-3 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium w-fit hover:bg-blue-50 transition-colors">
                      Explore More
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{item.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
            View All Destinations
          </button>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - 2rem)); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(calc(-100% - 2rem)); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-left {
          animation: scrollLeft 40s linear infinite;
          will-change: transform;
        }

        .animate-scroll-right {
          animation: scrollRight 40s linear infinite;
          will-change: transform;
        }

        .paused {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-left,
          .animate-scroll-right {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default ImageScroll;