"use server";

import connectDB from "../config/database";
import Property from "../models/Property";
import { getSessionUser } from "../utils/getSessionUser";
import { revalidatePath } from "next/cache";
import cloudinary from "../config/cloundinary";

export const addProperty = async (prevState, formData) => {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User id Required");
  }
  const { userId } = sessionUser;
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
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);

    // convert to base64
    const imageBase64 = imageData.toString("base64");

    // Make request to cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: "propertypulse",
      }
    );

    ImageUrls.push(result.secure_url);
  }

  propertyData.images = ImageUrls;
  const newProperty = new Property(propertyData);
  await newProperty.save();

  revalidatePath("/", "layout");
  return { success: true, propertyId: newProperty._id.toString() };
};

export default addProperty;
