"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { ShoppingCart, Star } from "lucide-react";
const API_BASE_URL = "https://seoul-sage.vercel.app"; 

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products?page=${currentPage}&limit=8`);
        const fetchedData = res.data.data || res.data;
        setProducts(fetchedData || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-[18px] font-medium italic text-gray-400">
          Seoul Mirage...
        </div>
      </div>
    );

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-10 lg:px-20 font-sans">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-12">
          <h1 className="text-[32px] md:text-[42px] font-normal text-[#111]">
            Our Collections
          </h1>
          <div className="h-[1px] w-20 bg-black mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => router.push(`/bestsellers/${product._id}`)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] bg-[#F9F9F9] overflow-hidden mb-5">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Add to Cart Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Added to cart!");
                    }}
                    className="bg-white px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 rounded-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-black hover:text-white"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                      Add to Cart
                    </span>
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col space-y-1">
                <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[2px] font-bold">
                  {product.category}
                </p>
                <h3 className="text-[14px] md:text-[16px] font-bold text-[#111] leading-tight group-hover:underline decoration-1 underline-offset-4 truncate">
                  {product.name}
                </h3>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[18px] md:text-[22px] font-black text-[#111]">
                    ${product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-[12px] md:text-[14px] text-gray-300 line-through font-medium">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-900">
                    {product.rating || "4.9"}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-gray-400">
                    ({product.reviews_count || "120"})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-24 flex justify-center items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage((p) => Math.max(1, p - 1));
            }}
            className={`w-10 h-10 flex items-center justify-center border border-gray-200 transition-all hover:border-black ${currentPage === 1 && "opacity-20 cursor-not-allowed"}`}
          >
            ←
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPage(page);
              }}
              className={`w-10 h-10 text-[13px] font-bold transition-all ${
                currentPage === page
                  ? "bg-[#F2EADA] text-black border-none"
                  : "text-gray-400 hover:text-black border border-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage((p) => p + 1);
            }}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 transition-all hover:border-black"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collections;