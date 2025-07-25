import BookMarkButton from "@/app/components/BookMarkButton";
import ContactForm from "@/app/components/ContactForm";
import PropertyDetails from "@/app/components/PropertyDetails";
import PropertyImagesScroll from "@/app/components/PropertyImages";
// import PropertyImages from "@/app/components/PropertyImages";
import ShareButtons from "@/app/components/ShareButtons";
import connectDB from "@/app/config/database";
import Property from "@/app/models/Property";
import { serializeMongoDoc } from "@/app/utils/serializeMongoDoc";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const PropertyPage = async ({ params }) => {
  const { id } = await params; // params is not async
  if (!id) return <div>Invalid ID</div>;

  await connectDB();
  const property = await Property.findById(id).lean();
  const serializedProperty = serializeMongoDoc(property);

  if (!serializedProperty) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }
  return (
    <>
      {/* Property Header Image */}
      <section>
        <div className="container-xl mx-auto">
          <div className="grid grid-cols-1">
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[700px] lg:h-[800px] ">
              <Image
                src={property?.images?.[0] || "/fallback.jpg"}
                alt="Property Image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Go Back */}
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Properties
          </Link>
        </div>
      </section>

      {/* Property Info */}
      <section className="bg-blue-50">
        <div className="container mx-auto py-12 px-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 lg:gap-12">
            <div className="space-y-6">
              <PropertyDetails property={serializedProperty} />
            </div>

            <aside className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <BookMarkButton property={serializedProperty} />
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <ShareButtons property={serializedProperty} showLabels />
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <ContactForm property={serializedProperty} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <PropertyImagesScroll images={property.images} />
    </>
  );
};

export default PropertyPage;
