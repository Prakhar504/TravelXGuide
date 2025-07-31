// import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// function HotelCardItem({ item }) {
//   const [photoUrl, setPhotoUrl] = useState(null);

//   useEffect(() => {
//     if (item?.hotelName) {
//       fetchHotelImage();
//     }
//   }, [item]);

//   const fetchHotelImage = async () => {
//     try {
//       const data = { textQuery: item.hotelName };
//       const response = await GetPlaceDetails(data);

//       if (response?.data?.places?.length > 0) {
//         const place = response.data.places[0];
//         const photoIndex = place.photos?.[3] ? 3 : 0; // Use 3rd image if available, else fallback to 1st
//         const photoName = place.photos?.[photoIndex]?.name;

//         if (photoName) {
//           setPhotoUrl(PHOTO_REF_URL.replace('{NAME}', photoName));
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching hotel image:', error);
//     }
//   };

//   return (
//     <div>
//       <Link
//         to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//           item?.hotelName + ', ' + item?.hotelAddress
//         )}`}
//         target="_blank"
//         className="hover:scale-105 transition-all cursor-pointer block"
//       >
//         <div className="rounded-xl shadow-md overflow-hidden bg-white p-4">
//           <img
//             src={photoUrl || '/road-trip-vacation.jpg'}
//             alt={item?.hotelName}
//             className="rounded-xl h-[180px] w-full object-cover"
//           />
//           <div className="my-3 py-2">
//             <h2 className="font-semibold text-lg">{item?.hotelName}</h2>
//             <h2 className="text-xs text-gray-500">📍 {item?.hotelAddress}</h2>
//             <h2 className="text-sm">💰 {item?.price}</h2>
//             <h2 className="text-sm text-yellow-500">⭐ {item?.rating}</h2>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }

// export default HotelCardItem;
