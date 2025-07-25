"use client";

import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/style.css";

const PropertyImagesScroll = ({ images }) => {
  if (!images || images.length <= 1) return null;

  // Exclude the header image (assumed to be images[0])
  const scrollImages = images.slice(1);

  return (
    <Gallery>
      <section className="bg-blue-50 overflow-x-auto">
        <div className="container m-auto py-10 px-6">
          <div className="flex gap-4 snap-x snap-mandatory overflow-x-auto px-4 sm:px-0">
            {scrollImages.map((img, i) => (
              <Item
                key={i}
                original={img}
                thumbnail={img}
                width="1200"
                height="800"
              >
                {({ ref, open }) => (
                  <div
                    ref={ref}
                    onClick={open}
                    className="snap-start flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-[20%] bg-white rounded-xl shadow-md cursor-pointer"
                  >
                    <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] rounded-t-xl overflow-hidden">
                      <Image
                        src={img}
                        alt={`Property Image ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">Image {i + 2}</h3>
                      <p className="text-sm text-gray-600">Additional View</p>
                    </div>
                  </div>
                )}
              </Item>
            ))}
          </div>
        </div>
      </section>
    </Gallery>
  );
};

export default PropertyImagesScroll;
