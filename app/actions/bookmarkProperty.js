"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../config/database";
import User from "../models/User";
import { getSessionUser } from "../utils/getSessionUser";

async function bookmarkProperty(propertyId) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("user Id is required");
  }

  const { userId } = sessionUser;

  const user = await User.findById(userId);

  let isBookmarked = user.bookMarks.includes(propertyId);
  let message;
  if (isBookmarked) {
    // If already bookmarked then remove
    user.bookMarks.pull(propertyId);
    message = "Bookmark removed";
    isBookmarked = false;
  } else {
    user.bookMarks.push(propertyId);
    message = "Bookmark added";
    isBookmarked = true;
  }

  await user.save();
  revalidatePath("/properties/saved", 'pages');

  return {
    message,
    isBookmarked,
  };
}

export default bookmarkProperty;
