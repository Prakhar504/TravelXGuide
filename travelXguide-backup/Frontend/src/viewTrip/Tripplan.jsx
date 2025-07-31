import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import InfoSection from "./component/InfoSection";
import Hotels from "./component/Hotels";
import PlacesToVisit from "./component/PlaceToVisit";

function TripPlan() {
  const { destination, days, budget, traveler } = useParams();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [hotelImages, setHotelImages] = useState([]); // ✅ Store all hotel images
  const [itineraryImages, setItineraryImages] = useState([]); // ✅ Store all itinerary images

  useEffect(() => {
    const tripDetails = {
      destination,
      days,
      budget,
      traveler,
    };

    setTrip(tripDetails);

    if (location.state?.tripData) {
      try {
        const parsedData = JSON.parse(location.state.tripData);
        setTripData(parsedData);
        console.log("Trip Data Debugging:", parsedData);

        // ✅ Extract Hotel Images
        let extractedHotelImages = [];
        if (parsedData.hotelOptions?.length > 0) {
          extractedHotelImages = parsedData.hotelOptions
            .map((hotel) => hotel.hotelImageUrl)
            .filter((url) => url); // Remove null/undefined values
        }

        // ✅ Extract Itinerary Images
        let extractedItineraryImages = [];
        if (parsedData.itinerary) {
          Object.values(parsedData.itinerary).forEach((day) => {
            if (day.places?.length > 0) {
              day.places.forEach((place) => {
                if (place.image_url) extractedItineraryImages.push(place.image_url);
              });
            }
          });
        }

        setHotelImages(extractedHotelImages);
        setItineraryImages(extractedItineraryImages);

        console.log("Extracted Hotel Images:", extractedHotelImages);
        console.log("Extracted Itinerary Images:", extractedItineraryImages);
      } catch (error) {
        console.error("Error parsing AI response:", error);
      }
    } else {
      console.warn("No trip data received!");
    }
  }, [destination, days, budget, traveler, location.state]);

  return (
    <div className='p-4 sm:p-8 md:px-20 lg:px-32 xl:px-56'>
      {/* ✅ Pass Image URLs to Components */}
      <InfoSection trip={trip} />
      <Hotels trip={trip} tripData={tripData} hotelImages={hotelImages} />
      <PlacesToVisit tripData={tripData} itineraryImages={itineraryImages} />
    </div>
  );
}

export default TripPlan;
