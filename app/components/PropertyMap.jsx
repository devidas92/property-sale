// "use client";

// import { useEffect, useState } from "react";
// import { setDefaults, fromAddress } from "react-geocode";
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import Spinner from "./Spinner";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const containerStyle = {
//   width: "100%",
//   height: "50vh", // Responsive height
// };

// const PropertyMap = ({ property }) => {
//   const [lat, setLat] = useState(null);
//   const [lng, setLng] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [geocodeError, setGeocodeError] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     mapIds: [process.env.NEXT_PUBLIC_GOOGLE_MAP_ID], // Optional: use map style ID for dark mode or custom styles
//   });

//   // Initialize Geocoding
//   useEffect(() => {
//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY;
//     if (!apiKey) {
//       console.warn("Google Geocoding API key is missing!");
//     }
//     setDefaults({
//       key: apiKey,
//       language: "en",
//       region: "us",
//     });
//   }, []);

//   // Fetch Coordinates
//   useEffect(() => {
//     const fetchCoords = async () => {
//       try {
//         const address = `${property.location.street}, ${property.location.city}, ${property.location.state}`;
//         const response = await fromAddress(address);

//         if (!response.results.length) {
//           throw new Error("No results found for the provided address.");
//         }

//         const { lat, lng } = response.results[0].geometry.location;
//         setLat(lat);
//         setLng(lng);
//       } catch (error) {
//         const message = error.message || "Failed to get location data.";
//         toast.error(message);
//         setGeocodeError(message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoords();
//   }, [property]);

//   if (loading || !isLoaded) return <Spinner />;

//   if (geocodeError)
//     return <MapError message={"Property Location Not Avaiable"} />;

//   return (
//     <div className="mt-4">
//       <div className="text-sm text-gray-600 dark:text-gray-300">
//         <p>Latitude: {lat?.toFixed(6)}</p>
//         <p>Longitude: {lng?.toFixed(6)}</p>
//       </div>

//       <div className="mt-4 border rounded overflow-hidden shadow">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={{ lat, lng }}
//           zoom={15}
//           mapContainerClassName="rounded"
//           options={{
//             disableDefaultUI: true,
//             zoomControl: true,
//             mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined,
//           }}
//         >
//           <Marker position={{ lat, lng }} />
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default PropertyMap;

// const MapError = ({ message }) => (
//   <div className="p-4 mt-4 bg-red-100 text-red-800 rounded text-center">
//     <p className="text-lg font-semibold">Unable to display map</p>
//     <p className="text-sm">{message}</p>
//   </div>
// );

"use client";

import { useEffect, useState } from "react";
import { setDefaults, fromAddress } from "react-geocode";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

const containerStyle = {
  width: "100%",
  height: "50vh",
};

// Default fallback location (e.g., center of US)
const fallbackCoords = {
  lat: 39.8283,
  lng: -98.5795,
};

const PropertyMap = ({ property }) => {
  const [coords, setCoords] = useState(fallbackCoords);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(null);

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const geocodeKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsKey || "", // fallback to empty string if undefined
  });

  // Set geocode defaults
  useEffect(() => {
    if (!geocodeKey) {
      console.warn("Missing Google Geocoding API key");
      toast.error("Google Maps is not configured correctly.");
    }

    setDefaults({
      key: geocodeKey,
      language: "en",
    });
  }, [geocodeKey]);

  // Fetch coordinates for the property
  useEffect(() => {
    const fetchCoords = async () => {
      if (!geocodeKey) {
        setCoords(fallbackCoords);
        setGeocodeError("No geocoding key provided.");
        setLoading(false);
        return;
      }

      try {
        const address = `${property.location.street}, ${property.location.city}, ${property.location.state}`;
        const response = await fromAddress(address);

        if (!response.results?.length) {
          throw new Error("No results found for the provided address.");
        }

        const { lat, lng } = response.results[0].geometry.location;
        setCoords({ lat, lng });
      } catch (err) {
        const message = err?.message || "Failed to geocode address.";
        toast.error(message);
        setGeocodeError(message);
        setCoords(fallbackCoords);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [property, geocodeKey]);

  // Loading state
  if (loading || !isLoaded) return <Spinner />;

  // Script loading error (often causes the "<" syntax error)
  if (loadError) {
    return (
      <MapError message="Google Maps failed to load. Check your API key and referrer settings." />
    );
  }

  // Geocode error (e.g., invalid address)
  if (geocodeError) {
    return <MapError message={geocodeError} />;
  }

  return (
    <div className="mt-4">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <p>Latitude: {coords.lat.toFixed(6)}</p>
        <p>Longitude: {coords.lng.toFixed(6)}</p>
      </div>

      <div className="mt-4 border rounded overflow-hidden shadow">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coords}
          zoom={15}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined,
          }}
        >
          <Marker position={coords} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default PropertyMap;

// Error display component
const MapError = ({ message }) => (
  <div className="p-4 mt-4 bg-red-100 text-red-800 rounded text-center">
    <p className="text-lg font-semibold">Map Unavailable</p>
    <p className="text-sm">{message}</p>
  </div>
);
