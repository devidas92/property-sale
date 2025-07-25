"use server";

import connectDB from "../config/database";
import Property from "../models/Property";
import { getSessionUser } from "../utils/getSessionUser";
import { revalidatePath } from "next/cache";
import cloudinary from "../config/cloundinary";

const updateProperty = async (prevState, propertyId, formData) => {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User id Required");
  }
  const { userId } = sessionUser;
  const existingProperty = await Property.findById(propertyId);

  // verify ownership
  if (existingProperty.owner.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  // Extract amenities and images
  const amenities = formData.getAll("amenities");
  const images = formData
    .getAll("images")
    .filter((image) => image instanceof File && image.name !== "");

  // Construct property object
  const propertyData = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipCode: formData.get("location.zipcode"),
    },
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    square_feet: formData.get("square_feet"),
    amenities,
    rates: {
      weekly: formData.get("rates.weekly"),
      monthly: formData.get("rates.monthly"),
      nightly: formData.get("rates.nightly"),
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
  };

  const ImageUrls = [];

  for (const imageFile of images) {
    if (imageFile.size === 0) continue;
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);

    const imageBase64 = imageData.toString("base64");
    if (!imageBase64) continue;

    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: "propertypulse",
      }
    );

    ImageUrls.push(result.secure_url);
  }

  // Existing cloudinary images

  const existingCloudinaryImages = formData.getAll("existingCloudinaryImages");

  propertyData.images = [...ImageUrls, ...existingCloudinaryImages];

  const removedCloudinaryImages = formData.getAll("removedCloudinaryImages");

  // Extract the publicID from image Urls
  const publicIds =
    removedCloudinaryImages.length > 0
      ? removedCloudinaryImages.map((imageUrl) => {
          const parts = imageUrl.split("/");
          return parts.at(-1).split(".")[0];
        })
      : [];

  // Delete images from cloudinary
  if (publicIds.length > 0) {
    for (let publicId of publicIds) {
      await cloudinary.uploader.destroy("propertypulse/" + publicId);
    }
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    propertyData
  );

  revalidatePath("/", "layout");
  return { success: true };
};

export default updateProperty;
