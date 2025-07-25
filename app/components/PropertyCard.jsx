"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Mapping for rate types
const rateLabelMap = {
  nightly: "night",
  weekly: "week",
  monthly: "month",
};

const fallbackImage = "/images/placeholder.jpg";

const PropertyCard = ({ property }) => {
  const [displayRate, setDisplayRate] = useState({
    rate: property.rates?.weekly ?? "0",
    per: "week",
  });

  const handleRateChange = (rateMode) => {
    setDisplayRate({
      rate: property.rates[rateMode],
      per: rateLabelMap[rateMode],
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative w-full h-52 sm:h-60 md:h-64">
        <Link href={`/properties/${property._id}`}>
          {/* Nested relative wrapper for Image */}
          <div className="relative w-full h-full">
            <Image
              src={property.images?.[0] || fallbackImage}
              alt={property.name}
              fill
              className="object-cover transition-opacity duration-300 hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </Link>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow text-blue-600 font-semibold text-sm">
          ${displayRate.rate}/{displayRate.per}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        {/* Name & Location */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {property.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1 truncate">
            <FaMapMarkerAlt className="mr-2" />
            {property.location?.street}, {property.location?.city},{" "}
            {property.location?.state}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-700 mt-4">
          <span className="flex items-center gap-1">
            <FaBed /> {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <FaBath /> {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <FaRulerCombined /> {property.square_feet} sqft
          </span>
        </div>

        {/* Rate Options */}
        <div className="flex gap-3 text-sm mt-4 flex-wrap">
          {Object.keys(property.rates).map((key) => (
            <button
              key={key}
              onClick={() => handleRateChange(key)}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition ${
                rateLabelMap[key] === displayRate.per
                  ? "font-medium underline bg-gray-100"
                  : ""
              }`}
            >
              <FaMoneyBill /> {rateLabelMap[key]}
            </button>
          ))}
        </div>

        {/* View Details */}
        <div className="pt-3 text-right">
          <Link
            href={`/properties/${property._id}`}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

export const MobileOptimizedCard = ({ property }) => {
  const { _id, name, location, images } = property;
  const address = `${location?.street}, ${location?.city}`;

  return (
    <Link href={`/properties/${_id}`} className="block group">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 transition-transform duration-200 group-hover:scale-[1.02] active:scale-95">
        {/* Image */}
        <div className="relative w-full h-48 sm:h-52">
          <Image
            src={images?.[0] || fallbackImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-800 truncate group-hover:text-blue-600">
            {name}
          </h3>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-blue-500 mr-2 shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
