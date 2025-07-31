import React from "react";
import { User } from "lucide-react";

function GuideCard({ guide, onKnowMore }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl p-6 max-w-xs mx-auto">
      <div className="w-40 h-40 mb-4 overflow-hidden border-4 border-blue-500 shadow-lg bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center relative rounded-xl">
        {guide.profileImage ? (
          <img
            src={`${backendUrl}${guide.profileImage}`}
            alt={guide.name + " profile photo"}
            className="w-full h-full object-cover rounded-xl"
            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
        ) : (
          <User className="w-20 h-20 text-blue-300" />
        )}
      </div>
      <h3 className="text-xl font-bold mb-1 text-center">{guide.name}</h3>
      <p className="text-xs text-gray-500 mb-2 text-center">Registration No: {guide.registration}</p>
      <p className="text-base text-gray-700 mb-1 text-center">
        <span className="font-semibold">Languages:</span> {guide.languages.join(", ")}
      </p>
      <p className="text-base text-gray-700 mb-3 text-center">
        <span className="font-semibold">Destinations:</span> {guide.destinations.join(", ")}
      </p>
      <div className="flex-grow" />
      <div className="flex items-center justify-between w-full mt-2">
        <button
          className="text-white bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          onClick={() => onKnowMore && onKnowMore(guide)}
        >
          Know More
        </button>
        <div className="flex text-yellow-500 ml-2 text-lg">
          {"★".repeat(guide.rating)}{"☆".repeat(5 - guide.rating)}
        </div>
      </div>
    </div>
  );
}

export default GuideCard;
