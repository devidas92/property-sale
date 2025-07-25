"use client";
import { useSession } from "next-auth/react";
import { FaBookmark } from "react-icons/fa";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import bookmarkProperty from "../actions/bookmarkProperty";
import checkBookMarkPropertyStatus from "../actions/checkBookMarkStatus";

const BookMarkButton = ({ property }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClick = useCallback(async () => {
    if (loading) return;

    if (!userId) {
      toast.error("You need to be signed in to bookmark a Property");
      return;
    }

    try {
      setLoading(true);
      const res = await bookmarkProperty(property._id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message);
        setIsBookmarked(res.isBookmarked);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [userId, property._id, loading]);

  useEffect(() => {
    // Wait until session loading is done
    if (status === "loading") return;

    const checkStatus = async () => {
      try {
        if (!userId) {
          // toast.error("You need to be signed in to view bookmark status");
          return;
        }

        const res = await checkBookMarkPropertyStatus(property._id);
        if (res.error) {
          toast.error(res.error);
        } else {
          setIsBookmarked(res.isBookmarked);
        }
      } catch {
        toast.error("Failed to fetch bookmark status.");
      } finally {
        // keep 50s timeout for testing
        setLoading(false);
      }
    };

    checkStatus();
  }, [status, userId, property._id]);

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark property"}
        className={`${
          isBookmarked
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FaBookmark className="mr-2" />
        {loading
          ? "Processing..."
          : isBookmarked
          ? "Remove Bookmark"
          : "Bookmark Property"}
      </button>
    </div>
  );
};

export default BookMarkButton;
