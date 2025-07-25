import PropertyEditForm from "@/app/components/PropertyEditForm";
import connectDB from "@/app/config/database";
import Property from "@/app/models/Property";
import { serializeMongoDoc } from "@/app/utils/serializeMongoDoc";

const propertyEditPage = async ({ params }) => {
  await connectDB();
  const { id } = await params;
  const propertyDoc = await Property.findById(id).lean();
  const serializedPropertyData = serializeMongoDoc(propertyDoc);

  if (!serializedPropertyData) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }
  return (
    <section className="bg-blue-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <PropertyEditForm property={serializedPropertyData} />
        </div>
      </div>
    </section>
  );
};
export default propertyEditPage;
