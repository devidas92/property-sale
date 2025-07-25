"use server";
import { revalidatePath } from "next/cache";
import cloudinary from "@/app/config/cloundinary";
import { getSessionUser } from "@/app/utils/getSessionUser";
import Property from "@/app/models/Property";

const deleteProperty = async (propertyId) => {
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;
  const property = await Property.findById(propertyId);

  if (!property) throw new Error("Property Not Found");

  // verify ownership

  if (property.owner.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  // Extract the publicID from image Urls
  const publicIds = property.images.map((imageUrl) => {
    const parts = imageUrl.split("/");
    return parts.at(-1).split(".")[0];
  });

  // Delete images from cloudinary
  if (publicIds.length > 0) {
    for (let publicId of publicIds) {
      await cloudinary.uploader.destroy("propertypulse/" + publicId);
    }
  }

  await property.deleteOne();

  revalidatePath("/", "layout");
};

export default deleteProperty;
