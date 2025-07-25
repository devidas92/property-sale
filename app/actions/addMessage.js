"use server";

import connectDB from "../config/database";
import Message from "../models/Message";
import { getSessionUser } from "../utils/getSessionUser";

export const addMessage = async (prevState, formData) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return { error: "User not authenticated" };
    }

    const senderId = sessionUser.userId;
    const recipientId = formData.get("recipient");

    if (!recipientId || senderId === recipientId) {
      return { warn: "You cannot send a message to yourself." };
    }

    const messageData = {
      sender: senderId,
      recipient: recipientId,
      property: formData.get("property"),
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim(),
      body: formData.get("message")?.trim(), // corrected: input is `message`, not `body`
    };

    // Basic required field check
    if (!messageData.name || !messageData.email || !messageData.body) {
      return { error: "Name, Email, and Message are required fields." };
    }

    const newMessage = new Message(messageData);
    await newMessage.save();

    return { submitted: true };
  } catch (err) {
    console.error("Failed to send message:", err);
    return { error: "Failed to send message. Please try again later." };
  }
};

export default addMessage;
