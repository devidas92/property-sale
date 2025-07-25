import MessageCard from "../components/MessageCard";
import connectDB from "../config/database";
import Message from "../models/Message";
import { getSessionUser } from "../utils/getSessionUser";
import { serializeMongoDoc } from "../utils/serializeMongoDoc";

const MessagePage = async () => {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        You must be signed in to view your messages.
      </div>
    );
  }

  const { userId } = sessionUser;

  // 🧠 Fetch all messages in one go, sorted by createdAt
  const messages = await Message.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("sender", "userName")
    .populate("property", "name")
    .lean();

  // 🔄 Serialize all data including nested sender and property
  const serializedMessages = serializeMongoDoc(messages).map((msg) => ({
    ...msg,
    sender: serializeMongoDoc(msg.sender),
    property: serializeMongoDoc(msg.property),
  }));

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto py-24 px-4 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Your Messages
          </h1>

          {serializedMessages.length === 0 ? (
            <p className="text-gray-600 text-center">You have no messages.</p>
          ) : (
            <div className="space-y-6">
              {serializedMessages.map((message) => (
                <MessageCard key={message._id} message={message} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
