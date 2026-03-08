import React from "react";
import Image from "next/image";

const ShopBy = () => {
  const categories = [
    {
      name: "Cleansers",
      image: "https://i.ibb.co/svpp6LJY/Rectangle-2-1.png",
    },
    {
      name: "Serums",
      image: "https://i.ibb.co/sdVKD4s8/Component-1-1.png",
    },
    {
      name: "Moisturizers",
      image: "https://i.ibb.co/PZKC9Ljc/Component-1-4.png",
    },
    {
      name: "Masks",
      image: "https://i.ibb.co/LhpH00bF/Rectangle-2.png",
    },
  ];

  return (
    <section className="bg-[#F8F5F5] py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        <h2 className="text-xl md:text-[22px] font-semibold text-[#111] mb-8 md:mb-10 tracking-tight">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer overflow-hidden aspect-square rounded-sm"
            >
              <div className="w-full h-full relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h3 className="text-white text-[16px] md:text-[20px] font-bold tracking-wide border-b-2 border-transparent group-hover:border-white transition-all duration-300 pb-1">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopBy;