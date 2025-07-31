import React from "react";
import { FaShare } from "react-icons/fa";

function InfoSection({ trip }) {
  if (!trip) {
    return <p className="text-center text-gray-500">No trip data available.</p>;
  }

  return (
    <div className=" mt-25 max-w-3xl mx-auto p-5 bg-gray-100 rounded-lg shadow-lg">
     

      {/* Trip Information Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl mt-2 sm:mt-0">
            {trip?.destination}
          </h2>

          <div className="flex flex-wrap gap-3 sm:gap-5 mt-2">
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-sm">
              📆 {trip?.days} Days
            </h2>
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-sm">
              💰 {trip?.budget} Budget
            </h2>
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-sm">
              🧑‍🤝‍🧑 Travelers: {trip?.traveler}
            </h2>
          </div>
        </div>

        {/* Share Button */}
        <button className="mt-3 sm:mt-0 sm:ml-5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          <FaShare />
        </button>
      </div>
    </div>
  );
}

export default InfoSection;

