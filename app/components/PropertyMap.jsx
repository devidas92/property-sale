"use client";

import { useEffect, useState } from "react";
import { setDefaults, fromAddress } from "react-geocode";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const containerStyle = {
  width: "100%",
  height: "50vh", // Responsive height
};

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    mapIds: [process.env.NEXT_PUBLIC_GOOGLE_MAP_ID], // Optional: use map style ID for dark mode or custom styles
  });

  // Initialize Geocoding
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY;
    if (!apiKey) {
      console.warn("Google Geocoding API key is missing!");
    }
    setDefaults({
      key: apiKey,
      language: "en",
      region: "us",
    });
  }, []);

  // Fetch Coordinates
  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const address = `${property.location.street}, ${property.location.city}, ${property.location.state}`;
        const response = await fromAddress(address);

        if (!response.results.length) {
          throw new Error("No results found for the provided address.");
        }

        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      } catch (error) {
        const message = error.message || "Failed to get location data.";
        toast.error(message);
        setGeocodeError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [property]);

  if (loading || !isLoaded) return <Spinner />;

  if (geocodeError)
    return <MapError message={"Property Location Not Avaiable"} />;

  return (
    <div className="mt-4">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <p>Latitude: {lat?.toFixed(6)}</p>
        <p>Longitude: {lng?.toFixed(6)}</p>
      </div>

      <div className="mt-4 border rounded overflow-hidden shadow">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat, lng }}
          zoom={15}
          mapContainerClassName="rounded"
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined,
          }}
        >
          <Marker position={{ lat, lng }} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default PropertyMap;

const MapError = ({ message }) => (
  <div className="p-4 mt-4 bg-red-100 text-red-800 rounded text-center">
    <p className="text-lg font-semibold">Unable to display map</p>
    <p className="text-sm">{message}</p>
  </div>
);
