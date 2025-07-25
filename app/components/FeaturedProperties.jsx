import connectDB from "../config/database";
import Property from "../models/Property";
import { serializeMongoDoc } from "../utils/serializeMongoDoc";
import FeaturedPropertyCard from "./FeaturedPropertyCard";

const FeaturedProperties = async () => {
  await connectDB();
  const properties = await Property.find({
    is_featured: true,
  }).lean();

  return properties.length > 0 ? (
    <section className="bg-blue-50 px-4 pt-6 pb-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Featured Properties
        </h2>

        {/* 🟢 Wrapper scroll only on mobile */}
        <div className="lg:hidden overflow-x-auto">
          <div className="flex gap-6 w-max scroll-smooth snap-x snap-mandatory pb-2">
            {properties.map((property) => {
              const serializedData = serializeMongoDoc(property);
              return (
                <div
                  key={serializedData._id}
                  className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px]"
                >
                  <FeaturedPropertyCard property={serializedData} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 🟦 Grid layout for large screens */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => {
            const serializedData = serializeMongoDoc(property);
            return (
              <FeaturedPropertyCard
                key={serializedData._id}
                property={serializedData}
              />
            );
          })}
        </div>
      </div>
    </section>
  ) : null;
};

export default FeaturedProperties;
