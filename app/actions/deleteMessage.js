"use server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/app/utils/getSessionUser";
import Message from "../models/Message";

const deleteMessage = async (messageId) => {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;
  const message = await Message.findById(messageId);

  if (!message) throw new Error("Message Not Found");

  // verify ownership

  if (message.recipient.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await message.deleteOne();
  revalidatePath("/", "layout");
};

export default deleteMessage;
