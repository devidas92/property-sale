"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBath, FaBed, FaMapMarker, FaMoneyBill, FaRulerCombined } from "react-icons/fa";

const rateLabelMap = {
  nightly: "night",
  weekly: "week",
  monthly: "month",
};

const FeaturedPropertyCard = ({ property }) => {
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
    <div className="bg-white rounded-xl  shadow-md relative flex flex-col md:flex-row h-full">
      <Image
        src={property.images[0]}
        alt=""
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto rounded-t-xl md:rounded-tr-none md:rounded-l-xl md:w-2/5"
      />
      <div className="p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold">{property.name}</h3>
          <div className="text-gray-600 mb-4">{property.type}</div>
        </div>

        <h3 className="absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          ${displayRate.rate}/{displayRate.per}
        </h3>

        <div className="flex justify-center gap-4 text-gray-500 mb-4 text-sm">
          <p>
            <FaBed className="inline-block mr-2" /> {property.beds}
            <span className="md:hidden lg:inline">Beds</span>
          </p>
          <p>
            <FaBath className="inline-block mr-2" /> {property.bath}
            <span className="md:hidden lg:inline">Baths</span>
          </p>
          <p>
            <FaRulerCombined className="inline-block mr-2" /> {property.sqft}{" "}
            <span className="md:hidden lg:inline">sqft</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 text-green-700 text-sm mb-4">
          {Object.keys(property.rates).map((key) => (
            <p
              key={key}
              onClick={() => handleRateChange(key)}
              className="flex items-center gap-1 cursor-pointer hover:underline"
            >
              <FaMoneyBill />
              {rateLabelMap[key]}
            </p>
          ))}
        </div>

        <div className="border border-gray-200 mb-4"></div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-orange-600 text-sm">
            <FaMapMarker />
            <span>
              {property.location.city}, {property.location.state}
            </span>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPropertyCard;
