"use client";

import { useSession } from "next-auth/react";
import { useActionState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";
import addMessage from "../actions/addMessage";

const ContactForm = ({ property }) => {
  const { data: session } = useSession();
  const [state, formAction, isPending] = useActionState(addMessage, null);

  useEffect(() => {
    if (!state) return;

    const { submitted, warn, error } = state;

    if (submitted) {
      toast.success("Message sent successfully!");
    } else if (warn) {
      toast.info(warn);
    } else if (error) {
      toast.error(error);
    }
  }, [state]);

  const inputClasses =
    "shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6">Contact Property Manager</h3>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="property" defaultValue={property._id} />
        <input type="hidden" name="recipient" defaultValue={property.owner} />

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone:
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Enter your phone number"
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            rows={6}
            className={`${inputClasses} resize-none`}
            required
          />
        </div>

        <div className="relative group w-full">
          <button
            type="submit"
            disabled={!session || isPending}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-white font-semibold focus:outline-none transition 
      ${
        !session || isPending
          ? "bg-blue-300 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }
    `}
          >
            <FaPaperPlane />
            {isPending ? "Sending..." : "Send Message"}
          </button>

          {/* Tooltip when user is not signed in */}
          {!session && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-10">
              You need to be sign in to Send Message
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
