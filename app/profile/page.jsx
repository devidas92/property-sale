import Link from "next/link";
import Image from "next/image";
import connectDB from "../config/database";
import { getSessionUser } from "../utils/getSessionUser";
import profileDefault from "@/assets/images/profile.png";
import Property from "../models/Property";
import ProfileProperties from "../components/ProfileProperties";
import { serializeMongoDoc } from "../utils/serializeMongoDoc";

const ProfilePage = async () => {
  await connectDB();
  const sessionuser = await getSessionUser();

  const { userId } = sessionuser;
  if (!userId) {
    throw new Error("User ID is required");
  }

  const properties = await Property.find({ owner: userId }).lean();
  const serializedProperties = serializeMongoDoc(properties);

  return (
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6 sm:p-10">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Profile Overview
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Info */}
            <aside className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
              <Image
                src={sessionuser.user.image || profileDefault}
                alt={sessionuser.user.name}
                width={128}
                height={128}
                className="rounded-full object-cover border border-gray-300"
              />
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">
                  {sessionuser.user.name}
                </p>
                <p className="text-sm text-gray-600">
                  {sessionuser.user.email}
                </p>
              </div>
            </aside>

            {/* Listings */}
            <main className="md:w-2/3">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Your Listings
                </h2>
              </div>
              <ProfileProperties properties={serializedProperties} />
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
