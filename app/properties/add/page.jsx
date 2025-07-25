"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import addProperty from "@/app/actions/addProperty";
import Image from "next/image";

const initialState = { success: false };

const AddPropertyPage = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [state, formAction, isPending] = useActionState(
    addProperty,
    initialState
  );

  useEffect(() => {
    if (state.success && state.propertyId) {
      formRef.current?.reset();
      setSelectedImages([]);
      setImageError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.push(`/properties/${state.propertyId}`);
    }
  }, [state]);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const totalFiles = selectedImages.length + newFiles.length;

    if (totalFiles > 4) {
      setImageError("You can only select up to 4 images.");
      return;
    }

    const updatedFiles = [...selectedImages, ...newFiles];
    setSelectedImages(updatedFiles);
    setImageError("");

    const dt = new DataTransfer();
    updatedFiles.forEach((file) => dt.items.add(file));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
  };

  const removeImage = (index) => {
    const updated = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updated);

    const dt = new DataTransfer();
    updated.forEach((file) => dt.items.add(file));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;

    if (updated.length <= 4) setImageError("");
  };

  return (
    <section className="bg-blue-50 py-20">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white border rounded-md shadow-sm p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Add Property
          </h1>

          <form action={formAction} ref={formRef} className="space-y-6">
            {/* Property Type */}
            <div>
              <label
                htmlFor="type"
                className="block font-medium text-gray-700 mb-1"
              >
                Property Type
              </label>
              <select
                id="type"
                name="type"
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="House">House</option>
                <option value="CabinOrCottage">Cabin or Cottage</option>
                <option value="Room">Room</option>
                <option value="Studio">Studio</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block font-medium text-gray-700 mb-1"
              >
                Listing Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Spacious Apartment in Mumbai"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="w-full border rounded px-3 py-2"
                placeholder="Add an optional description of your property"
              ></textarea>
            </div>

            {/* Location */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="location.street"
                  placeholder="Street"
                  className="border rounded px-3 py-2"
                />
                <input
                  name="location.city"
                  placeholder="City"
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  name="location.state"
                  placeholder="State"
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  name="location.zipcode"
                  placeholder="Zipcode"
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Property Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="number"
                name="beds"
                placeholder="Beds"
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="baths"
                placeholder="Baths"
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="square_feet"
                placeholder="Square Feet"
                className="border rounded px-3 py-2"
                required
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Wifi",
                  "Full kitchen",
                  "Washer & Dryer",
                  "Free Parking",
                  "Swimming Pool",
                  "Hot Tub",
                  "24/7 Security",
                  "Wheelchair Accessible",
                  "Elevator Access",
                  "Dishwasher",
                  "Gym/Fitness Center",
                  "Air Conditioning",
                  "Balcony/Patio",
                  "Smart TV",
                  "Coffee Maker",
                ].map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      className="mr-2"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            {/* Rates */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Rates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="number"
                  name="rates.weekly"
                  placeholder="Weekly"
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  name="rates.monthly"
                  placeholder="Monthly"
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  name="rates.nightly"
                  placeholder="Nightly"
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Seller Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="seller_info.name"
                placeholder="Seller Name"
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                name="seller_info.email"
                placeholder="Seller Email"
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="tel"
                name="seller_info.phone"
                placeholder="Seller Phone"
                className="border rounded px-3 py-2"
              />
            </div>

            {/* Images */}
            <div>
              <label
                htmlFor="images"
                className="block font-medium text-gray-700 mb-2"
              >
                Images (Max 4)
              </label>
              <input
                type="file"
                id="images"
                name="images"
                ref={fileInputRef}
                className="border rounded w-full py-2 px-3 mb-2"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
              />
              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}

              {/* Selected image preview */}
              {selectedImages.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {selectedImages.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-14 h-14 object-cover rounded"
                          width={14}
                          height={14}
                        />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 rounded-md text-white font-medium transition ${
                  isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPending ? "Submitting..." : "Add Property"}
              </button>
            </div>

            {state.success && (
              <p className="text-green-600 text-center mt-2">
                Property added successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddPropertyPage;
