// import axios from "axios";

// const RAPIDAPI_KEY = '4690a014e7mshe970e24d2ef322fp1b5165jsn2f8db7cebf61';

// const config = {
//   headers: {
//     "X-RapidAPI-Key": RAPIDAPI_KEY,
//     "X-RapidAPI-Host": "google-map-places.p.rapidapi.com",
//   },
// };

// // ✅ Fetch Place Details
// export const GetPlaceDetails = async (destination) => {
//   try {
//     const response = await axios.get(
//       "https://google-map-places.p.rapidapi.com/maps/api/place/textsearch/json",
//       {
//         params: { query: destination, language: "en" },
//         ...config,
//       }
//     );

//     if (response.data.results.length > 0) {
//       return response.data.results[0]; // Return first place found
//     } else {
//       throw new Error("No place found.");
//     }
//   } catch (error) {
//     console.error("Error fetching place details:", error);
//     return null;
//   }
// };

// // ✅ Fetch Resolved Photo URL
// export const GetPlacePhotoUrl = (photoReference) => {
//     if (!photoReference) return "/default-place.jpg"; // Fallback image
  
//     return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoReference}&key=YOUR_GOOGLE_MAPS_API_KEY`;
//   };
  
  