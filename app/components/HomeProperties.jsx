import Link from "next/link";
import PropertyCard, { MobileOptimizedCard } from "./PropertyCard";
import connectDB from "../config/database";
import Property from "../models/Property";
import { serializeMongoDoc } from "../utils/serializeMongoDoc";

const HomeProperties = async () => {
  await connectDB();
  const recentProperties = await Property.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const serializedData = serializeMongoDoc(recentProperties);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>

          {serializedData.length === 0 ? (
            <div className="text-center">No Properties</div>
          ) : (
            <>
              {/* Mobile: horizontal scroll cards */}
              <div className="flex md:hidden gap-4 overflow-x-auto snap-x pb-2 scroll-smooth">
                {serializedData.map((property) => (
                  <div
                    key={property._id}
                    className="min-w-[280px] snap-start shrink-0"
                  >
                    <MobileOptimizedCard property={property} />
                  </div>
                ))}
              </div>

              {/* Tablet & Desktop: grid layout */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serializedData.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700 transition-all"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
