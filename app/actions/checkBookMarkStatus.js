"use server";

import connectDB from "../config/database";
import User from "../models/User";
import { getSessionUser } from "../utils/getSessionUser";
import { Types } from "mongoose";

async function checkBookMarkStatus(propertyId) {
  await connectDB();

  // Validate propertyId
  if (typeof propertyId !== "string" || !Types.ObjectId.isValid(propertyId)) {
    throw new Error("Invalid property ID");
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("User not authenticated");
  }

  const user = await User.findById(sessionUser.userId);
  if (!user || !Array.isArray(user.bookMarks)) {
    return false;
  }

  const objectId = new Types.ObjectId(propertyId); // Safe string usage
  const isBookmarked = user.bookMarks.some((id) => id.equals(objectId));

  return { isBookmarked };
}

export default checkBookMarkStatus;
