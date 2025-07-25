import PropertyCard from "@/app/components/PropertyCard";
import connectDB from "@/app/config/database";
import User from "@/app/models/User";
import { getSessionUser } from "@/app/utils/getSessionUser";
import { serializeMongoDoc } from "@/app/utils/serializeMongoDoc";

const SavedPropertiesPage = async () => {
  await connectDB();
  const { userId } = await getSessionUser();
  const user = await User.findById(userId).populate("bookMarks").lean();
  const bookMarks = user?.bookMarks || [];

  return (
    <div className="container lg:container m-auto px-4 py-6">
      <h1 className="text-2xl mb-4">Saved Properties</h1>

      {bookMarks.length === 0 ? (
        <p>No saved properties</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookMarks.map((property) => {
            const serializedProperty = serializeMongoDoc(property);
            return (
              <PropertyCard
                key={serializedProperty._id}
                property={serializedProperty}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;
