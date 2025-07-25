"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import deleteProperty from "@/app/actions/deleteProperty";
import { toast } from "sonner";

const ProfileProperties = ({ properties: initialProperties }) => {
  const [properties, setProperties] = useState(initialProperties || []);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    setDeletingId(id);
    toast.info("Deleting...");

    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (properties.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        You haven’t listed any properties yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div
          key={property._id}
          className="bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between"
        >
          {/* Image + Link */}
          <Link href={`/properties/${property._id}`}>
            <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
              <Image
                src={property.images?.[0] || "/fallback.jpg"}
                alt={property.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded"
              />
            </div>
          </Link>

          {/* Title + Location */}
          <div className="mb-3">
            <h3 className="text-base font-medium text-gray-800 truncate">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {property.location?.street}, {property.location?.city},{" "}
              {property.location?.state}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2 mt-auto border-t border-gray-100">
            <Link
              href={`/properties/${property._id}/edit`}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(property._id)}
              disabled={deletingId === property._id}
              className="text-sm text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === property._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileProperties;
