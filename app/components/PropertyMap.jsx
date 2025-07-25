"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { fromAddress, setDefaults } from "react-geocode";
import { toast } from "react-toastify";

setDefaults({
  key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
  language: "en",
  region: "in",
});

const defaultLocation = {
  lat: 28.6139,
  lng: 77.209,
};

const MapError = ({ message }) => (
  <div className="p-4 mt-4 bg-red-100 text-red-800 rounded text-center">
    <p className="text-lg font-semibold">Map Unavailable</p>
    <p className="text-sm">{message}</p>
  </div>
);

const LocationMap = ({ address }) => {
  const [location, setLocation] = useState(defaultLocation);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (address) {
      fromAddress(address)
        .then(({ results }) => {
          if (results.length === 0) {
            throw new Error("No results found for this address.");
          }
          const { lat, lng } = results[0].geometry.location;
          setLocation({ lat, lng });
          setFormattedAddress(results[0].formatted_address);
          setError(""); // clear previous errors
        })
        .catch((err) => {
          console.error("Geocoding error:", err);
          setError("Unable to locate the address. Please check the input.");
          toast.error("Failed to load map");
        });
    }
  }, [address]);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      onLoadError={() => {
        setError("Google Maps failed to load. Check API key or internet.");
        toast.error("Google Maps failed to load");
      }}
    >
      {error ? (
        <MapError message={error} />
      ) : (
        <>
          <Map
            center={location}
            zoom={15}
            style={{ width: "100%", height: "50vh", borderRadius: "8px" }}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            <Marker position={location} />
          </Map>

          {formattedAddress && (
            <p className="mt-4 font-semibold text-gray-800">
              📍 {formattedAddress}
            </p>
          )}
        </>
      )}
    </APIProvider>
  );
};

export default LocationMap;
