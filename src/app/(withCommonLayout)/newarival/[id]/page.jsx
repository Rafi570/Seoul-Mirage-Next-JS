"use client"

import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import useAxios from "@/hooks/useAxios";
import { AuthContext } from "@/contexts/AuthContext";


const ProductsDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const axios = useAxios();
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products`);
        const allProducts = res.data || [];
        const found = allProducts.find((p) => String(p._id) === String(id));
        if (isMounted) {
          if (found) {
            setProduct(found);
            setMainImg(found.mainImage);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => { isMounted = false; };
  }, [id, axios]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-xl animate-pulse">
        Loading Seoul Mirage...
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-bold text-gray-400 italic">Product not found!</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition-all"
        >
          Back to Home
        </button>
      </div>
    );

  const handleDirectCheckout = async () => {
    if (!user) {
      toast.error("Please login first to place an order!");
      router.push("/login");
      return;
    }
    
    const orderData = {
      userEmail: user.email,
      shippingAddress: "Default Address",
      items: [{
          productId: product._id,
          name: product.name,
          quantity: quantity,
          price: product.price,
          image: product.mainImage,
      }],
      totalAmount: product.price * quantity,
    };

    try {
      const res = await axios.post("/api/orders/checkout", orderData);
      if (res.status === 201) {
        toast.success(res.data.message || "Order placed successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed!");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
        {/* LEFT: Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-5 w-full lg:w-[55%]">
          <div className="flex flex-row lg:flex-col gap-3 lg:gap-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible">
            {(product.images || [product.mainImage]).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setMainImg(img)}
                className={`flex-shrink-0 w-20 h-28 border rounded-sm overflow-hidden cursor-pointer relative transition-all duration-300 ${
                  mainImg === img ? "border-black ring-1 ring-black" : "border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} fill className="object-cover" alt="thumb" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-[#F9F9F9] rounded-sm overflow-hidden aspect-[4/5] relative group border border-gray-100">
            <Image
              src={mainImg}
              fill
              className="object-cover shadow-sm transition-transform duration-700 hover:scale-105"
              alt="main"
              priority
            />
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-[45%] flex flex-col">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#111] leading-tight mb-2 tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-8">
            <div className="text-black text-sm">★★★★★</div>
            <span className="text-gray-500 text-[13px] font-medium">{product.reviews_count || 157} Reviews</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-10 border-b border-gray-100 pb-4 sm:pb-8">
            <span className="text-3xl sm:text-[48px] font-bold text-[#111] leading-none">${product.price}</span>
            {product.oldPrice && (
              <span className="text-lg sm:text-[24px] text-gray-300 line-through mb-1 font-medium">${product.oldPrice}</span>
            )}
            <span className="text-blue-600 font-bold text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-tighter">◆ Limited Time Offer</span>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-bold text-[#111] mb-4">Details</h4>
              <p className="text-[#111] font-semibold text-[14px] sm:text-[16px] leading-relaxed mb-6">{product.description}</p>
            </div>
            <div className="space-y-6 text-[14px]">
              <div>
                <h5 className="font-black text-[12px] uppercase tracking-widest mb-2 text-gray-900">STRAIGHT UP:</h5>
                <p className="text-gray-600 leading-relaxed">{product.details || "Clean, vegan, and cruelty-free formula."}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6">
            <button
              onClick={handleDirectCheckout}
              className="flex-1 bg-black text-white h-[50px] sm:h-[56px] rounded-sm font-bold hover:bg-[#222] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              Add to Cart <span className="text-xl">→</span>
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-6 sm:mt-10 text-gray-400 underline text-sm hover:text-black transition-colors block"
          >
            ← Back to previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;