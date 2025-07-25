"use client";

import { useState } from "react";
import markMessageAsRead from "../actions/markMessagesAsRead";
import deleteMessage from "../actions/deleteMessage";
import { toast } from "sonner";
import { useGlobalContext } from "../utils/context/GlobalContext";

const MessageCard = ({ message }) => {
  const { _id, sender, property, body, phone, createdAt, email } = message;

  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { setReadCount } = useGlobalContext();

  const handleToggleRead = async () => {
    if (isUpdating || isDeleting) return;

    try {
      setIsUpdating(true);
      const updatedStatus = await markMessageAsRead(_id);
      setIsRead(updatedStatus);

      setReadCount((prev) => (updatedStatus ? prev - 1 : prev + 1));
      toast.success(`Marked as ${updatedStatus ? "Read" : "Unread"}`);
    } catch {
      toast.error("Failed to update message status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (isDeleting || isUpdating) return;

    try {
      setIsDeleting(true);
      await deleteMessage(_id);

      // Update read count only if the message was unread
      if (!isRead) {
        setReadCount((prev) => prev - 1);
      }

      setIsDeleted(true);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));

  if (isDeleted) return null;

  return (
    <article className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            From: {sender?.userName || "Unknown Sender"}
          </h2>
          <p className="text-sm text-gray-600">
            Property:{" "}
            <span className="font-medium">{property?.name || "Unnamed"}</span>
          </p>
        </div>
        <div className="self-start sm:self-center">
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full min-w-[70px] text-center border transition-colors ${
              isRead
                ? "bg-gray-100 text-gray-700 border-gray-300"
                : "bg-green-100 text-green-700 border-green-300"
            }`}
          >
            {isRead ? "Read" : "Unread"}
          </span>
        </div>
      </header>

      {/* Body */}
      <section className="text-sm text-gray-700 whitespace-pre-line">
        {body || (
          <em className="text-gray-400">No message content provided.</em>
        )}
      </section>

      {/* Contact Info */}
      <section className="text-sm text-gray-600 space-y-1">
        {email && (
          <p>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${email}`}
              className="text-blue-600 hover:underline"
            >
              {email}
            </a>
          </p>
        )}
        {phone && (
          <p>
            <strong>Phone:</strong>{" "}
            <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
              {phone}
            </a>
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t text-sm text-gray-500">
        <p className="text-xs">Sent on: {formatDate(createdAt)}</p>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleToggleRead}
            disabled={isUpdating || isDeleting}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm transition ${
              isRead
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpdating
              ? "Updating..."
              : isRead
              ? "Mark as Unread"
              : "Mark as Read"}
          </button>

          <button
            onClick={handleDeleteClick}
            disabled={isDeleting || isUpdating}
            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </footer>
    </article>
  );
};

export default MessageCard;
