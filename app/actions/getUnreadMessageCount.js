"use server";
import { revalidatePath } from "next/cache";
import connectDB from "../config/database";
import Message from "../models/Message";
import { getSessionUser } from "../utils/getSessionUser";

export const getUnreadMessageCount = async () => {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return new Error("User not authenticated");
  }
  const { userId } = sessionUser;
  const count = await Message.countDocuments({
    recipients: userId,
    read: false,
  });

  return { count };
};

export default getUnreadMessageCount;
