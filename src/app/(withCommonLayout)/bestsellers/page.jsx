"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useAxios from "@/hooks/useAxios";

const Bestsellers = () => {
  const [products, setProducts] = useState([]);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get("/api/products?page=1&limit=4")
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.error(err));
  }, [axios]);

  return (
    <div className="max-w-screen-2xl mx-auto px-10 py-16">
      <h2 className="text-2xl font-bold mb-10">Bestsellers</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <div key={product._id} className="group cursor-pointer">
            <div className="relative aspect-[1/1.2] overflow-hidden bg-[#F9F9F9] rounded-sm mb-3">
              <Link href={`/bestsellers/${product._id}`}>
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] md:text-[12px] text-gray-500 uppercase tracking-widest">
                {product.category}
              </p>
              <h3 className="font-semibold text-[#111] text-sm md:text-lg truncate">
                {product.name}
              </h3>
              <p className="text-xl md:text-3xl font-bold text-[#111]">
                ${product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestsellers;