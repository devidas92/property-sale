import Link from "next/link";
import InfoBox from "./InfoBox";

const InfoBoxes = () => {
  return (
    //   < !--Renters and Owners-- >
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox
            heading="For Renters"
            backgroundColor="bg-gray-100"
            buttonInfo={{
              backgroundColor: "bg-black",
              href: "/properties",
              hover: "hover:bg-gray-700",
              text: "Add Property",
              textColor: "text-white",
            }}
          >
            Find your dream rental property. Bookmark properties and contact
            owners.
          </InfoBox>
          <InfoBox
            heading="For Property Owners"
            backgroundColor="bg-blue-100"
            buttonInfo={{
              backgroundColor: "bg-blue-500",
              href: "/properties/add",
              hover: "hover:bg-blue-600",
              text: "Add Property",
              textColor: "text-white",
            }}
          >
            List your properties and reach potential tenants. Rent as an airbnb
            or long term.
          </InfoBox>
        </div>
      </div>
    </section>
  );
};

export default InfoBoxes;
