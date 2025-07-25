"use server";
import { revalidatePath } from "next/cache";
import connectDB from "../config/database";
import Message from "../models/Message";
import { getSessionUser } from "../utils/getSessionUser";

export const markMessageAsRead = async (messageId) => {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return new Error("User not authenticated");
  }
  const { userId } = sessionUser;
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not Found");
  if (message.recipient.toString() !== userId) {
    throw new Error("Unauthorized");
  }
  message.read = !message.read;
  revalidatePath("/message", "page");
  await message.save();
  return message.read;
};

export default markMessageAsRead;
