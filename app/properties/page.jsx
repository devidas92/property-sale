import Pagination from "../components/Pagination";
import PropertyCard from "../components/PropertyCard";
import connectDB from "../config/database";
import Property from "../models/Property";
import { serializeMongoDoc } from "../utils/serializeMongoDoc";

const PropertiesPage = async ({ searchParams }) => {
  await connectDB();
  const data = await searchParams;
  const page = parseInt(data?.page || "1", 10);
  const pageSize = parseInt(data?.pageSize || "3", 10);

  const skip = (page - 1) * pageSize;
  const total = await Property.countDocuments({});
  const properties = await Property.find({}).skip(skip).limit(pageSize).lean();
  const serializedData = serializeMongoDoc(properties);

  const showPagination = total > pageSize;
  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {serializedData.length === 0 ? (
          <div>No Properties</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serializedData.map((property) => {
              return <PropertyCard key={property._id} property={property} />;
            })}
          </div>
        )}
        {showPagination ? (
          <Pagination
            page={parseInt(page)}
            pageSize={parseInt(pageSize)}
            totalItems={total}
          />
        ) : null}
      </div>
    </section>
  );
};

export default PropertiesPage;
