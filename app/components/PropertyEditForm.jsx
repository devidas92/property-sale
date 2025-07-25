"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import updateProperty from "../actions/updateProperty";

const initialState = { success: false };
const MAX_IMAGES = 4;

const PropertyEditForm = ({ property }) => {
  const router = useRouter();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cloudinaryImages, setCloudinaryImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageError, setImageError] = useState("");

  const [state, formAction, isPending] = useActionState(
    (prevState, formData) => updateProperty(prevState, property._id, formData),
    initialState
  );

  const visibleCloudImages = useMemo(
    () => cloudinaryImages.filter((img) => img.isVisible),
    [cloudinaryImages]
  );

  useEffect(() => {
    const initialImages = property.images.map((url) => ({
      id: uuidv4(),
      type: "url",
      data: url,
      isVisible: true,
    }));
    setCloudinaryImages(initialImages);
  }, [property]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setSelectedImages([]);
      setCloudinaryImages([]);
      setImagePreviews([]);
      setImageError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.push(`/properties/${property._id}`);
    }
  }, [state]);

  useEffect(() => {
    const previews = selectedImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews(previews);

    return () => {
      previews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const total =
      visibleCloudImages.length + selectedImages.length + files.length;

    if (total > MAX_IMAGES) {
      setImageError(`You can only select up to ${MAX_IMAGES} images.`);
      return;
    }

    const updatedFiles = [...selectedImages, ...files];
    setSelectedImages(updatedFiles);
    setImageError("");

    const dt = new DataTransfer();
    updatedFiles.forEach((file) => dt.items.add(file));
    fileInputRef.current.files = dt.files;
  };

  const removeImage = ({ type, id, index }) => {
    if (type === "url") {
      setCloudinaryImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, isVisible: false } : img))
      );
    } else {
      const updated = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updated);

      const dt = new DataTransfer();
      updated.forEach((file) => dt.items.add(file));
      fileInputRef.current.files = dt.files;
    }

    const remaining = visibleCloudImages.length + selectedImages.length - 1;
    if (remaining <= MAX_IMAGES) setImageError("");
  };

  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      {/* Property Type */}
      <div>
        <label htmlFor="type" className="block font-medium text-gray-700 mb-1">
          Property Type
        </label>
        <select
          id="type"
          name="type"
          className="w-full border rounded px-3 py-2"
          required
          defaultValue={property.type}
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
        <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
          Listing Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. Spacious Apartment in Mumbai"
          required
          defaultValue={property.name}
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
          defaultValue={property.description}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">Location</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="location.street"
            placeholder="Street"
            className="border rounded px-3 py-2"
            defaultValue={property.location.street}
          />
          <input
            name="location.city"
            placeholder="City"
            required
            className="border rounded px-3 py-2"
            defaultValue={property.location.city}
          />
          <input
            name="location.state"
            placeholder="State"
            required
            className="border rounded px-3 py-2"
            defaultValue={property.location.state}
          />
          <input
            name="location.zipcode"
            placeholder="Zipcode"
            className="border rounded px-3 py-2"
            defaultValue={property.location.zipCode}
          />
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="number"
          name="beds"
          placeholder="Beds"
          required
          className="border rounded px-3 py-2"
          defaultValue={property.beds}
        />
        <input
          type="number"
          name="baths"
          placeholder="Baths"
          required
          className="border rounded px-3 py-2"
          defaultValue={property.baths}
        />
        <input
          type="number"
          name="square_feet"
          placeholder="Square Feet"
          required
          className="border rounded px-3 py-2"
          defaultValue={property.square_feet}
        />
      </div>

      {/* Amenities */}
      <fieldset>
        <legend className="font-medium text-gray-700 mb-2">Amenities</legend>
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
                defaultChecked={property.amenities.includes(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Rates */}
      <fieldset>
        <legend className="font-medium text-gray-700 mb-2">Rates</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="number"
            name="rates.weekly"
            placeholder="Weekly"
            required
            className="border rounded px-3 py-2"
            defaultValue={property.rates?.weekly}
          />
          <input
            type="number"
            name="rates.monthly"
            placeholder="Monthly"
            className="border rounded px-3 py-2"
            defaultValue={property.rates?.monthly}
          />
          <input
            type="number"
            name="rates.nightly"
            placeholder="Nightly"
            className="border rounded px-3 py-2"
            defaultValue={property.rates?.nightly}
          />
        </div>
      </fieldset>

      {/* Seller Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          name="seller_info.name"
          placeholder="Seller Name"
          className="border rounded px-3 py-2"
          defaultValue={property.seller_info?.name}
        />
        <input
          type="email"
          name="seller_info.email"
          placeholder="Seller Email"
          required
          className="border rounded px-3 py-2"
          defaultValue={property.seller_info?.email}
        />
        <input
          type="tel"
          name="seller_info.phone"
          placeholder="Seller Phone"
          className="border rounded px-3 py-2"
          defaultValue={property.seller_info?.phone}
        />
      </div>

      {/* Images */}
      <div>
        <label
          htmlFor="images"
          className="block font-medium text-gray-700 mb-2"
        >
          Images (Max {MAX_IMAGES})
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
        />
        {imageError && <p className="text-sm text-red-500">{imageError}</p>}

        {/* Cloudinary Images */}
        {visibleCloudImages.length > 0 && (
          <ul className="space-y-2 mt-2">
            {visibleCloudImages.map((img, index) => (
              <li
                key={img.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={img.data}
                    alt={`Image ${index + 1}`}
                    className="w-14 h-14 object-cover rounded"
                    width={56}
                    height={56}
                  />
                  <span className="text-sm">Existing Image {index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage({ type: "url", id: img.id })}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* New Image Previews */}
        {imagePreviews.length > 0 && (
          <ul className="space-y-2 mt-2">
            {imagePreviews.map(({ file, url }, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={url}
                    alt={file.name}
                    className="w-14 h-14 object-cover rounded"
                    width={56}
                    height={56}
                  />
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage({ type: "file", index })}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hidden Inputs for Removed Cloudinary Images */}
      {cloudinaryImages
        .filter((img) => !img.isVisible)
        .map((img) => (
          <input
            key={img.id}
            type="hidden"
            name="removedCloudinaryImages"
            value={img.data}
          />
        ))}

      {cloudinaryImages
        .filter((img) => img.isVisible)
        .map((img) => (
          <input
            key={img.id}
            type="hidden"
            name="existingCloudinaryImages"
            value={img.data}
          />
        ))}

      {/* Submit */}
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
          {isPending ? "Submitting..." : "Update Property"}
        </button>
      </div>

      {state.success && (
        <p className="text-green-600 text-center mt-2">
          Property updated successfully!
        </p>
      )}
    </form>
  );
};

export default PropertyEditForm;
