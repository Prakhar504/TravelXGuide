import React from "react";
import { FaShare } from "react-icons/fa";

function InfoSection({ trip }) {
  if (!trip) {
    return <p className="text-center text-gray-500">No trip data available.</p>;
  }

  return (
    <div className="w-full mb-8 md:mb-12">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Image Section */}
        <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/tajmahal.jpg"
            alt="Trip Destination"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Share Button - Floating on image */}
          <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg">
            <FaShare className="text-lg" />
          </button>
        </div>

        {/* Trip Information Section */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {trip?.destination}
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-blue-700 text-sm md:text-base font-medium">
                <span className="text-lg">📆</span>
                <span>{trip?.days} Days</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl text-green-700 text-sm md:text-base font-medium">
                <span className="text-lg">💰</span>
                <span>{trip?.budget}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl text-purple-700 text-sm md:text-base font-medium">
                <span className="text-lg">🧑‍🤝‍🧑</span>
                <span>{trip?.traveler}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;

