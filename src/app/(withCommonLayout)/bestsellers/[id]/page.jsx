"use client";

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
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products`);
        const allProducts = res.data || [];
        const found = allProducts.find((p) => String(p._id) === String(id));
        if (found) {
          setProduct(found);
          setMainImg(found.mainImage || found.image);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, axios]);

  const handleDirectCheckout = async () => {
    if (!user) {
      alert("Please login first to place an order!");
      router.push("/login");
      return;
    }

    const orderData = {
      userEmail: user.email,
      shippingAddress: "Default Address (Please update in profile)",
      items: [
        {
          productId: product._id,
          name: product.name,
          quantity: quantity,
          price: product.price,
          image: product.mainImage || product.image,
        },
      ],
      totalAmount: product.price * quantity,
    };

    try {
      // আপনার অরিজিনাল অর্ডার এন্ডপয়েন্ট
      const res = await axios.post("/api/orders/checkout", orderData);
      if (res.status === 201 || res.status === 200) {
        alert(`✅ ${res.data.message || "Order placed successfully!"}`);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Order failed! Try again.");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-xl animate-pulse text-black uppercase  ">
        Loading Seoul Mirage...
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-bold text-gray-400   uppercase">Product not found!</p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
        >
          Back to Collection
        </button>
      </div>
    );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
        
        {/* LEFT: Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-5 w-full lg:w-[55%]">
          <div className="flex flex-row lg:flex-col gap-3 lg:gap-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {(product.images || [product.mainImage]).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setMainImg(img)}
                className={`flex-shrink-0 w-20 h-28 border rounded-sm overflow-hidden cursor-pointer relative transition-all duration-300 ${
                  mainImg === img ? "border-black ring-1 ring-black scale-95" : "border-gray-100 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} fill className="object-cover" alt="thumbnail" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-[#F9F9F9] rounded-sm overflow-hidden aspect-[4/5] relative group border border-gray-100">
            <Image
              src={mainImg}
              fill
              className="object-cover shadow-sm transition-transform duration-1000 group-hover:scale-110"
              alt="main product"
              priority
            />
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-[45%] flex flex-col">
          <p className="text-[10px] font-black text-[#CCAF91] uppercase tracking-[0.3em] mb-4">
            {product.category || "Luxury Skincare"}
          </p>
          <h1 className="text-3xl md:text-[40px] font-black text-[#111] leading-tight mb-4 tracking-tighter   uppercase">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <div className="text-black text-xs tracking-widest">★★★★★</div>
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              {product.reviews_count || 157} Verified Reviews
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-10 border-b border-gray-50 pb-8">
            <span className="text-4xl sm:text-[54px] font-black text-[#111] leading-none   tracking-tighter">
              ${product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xl text-gray-300 line-through mb-1 font-bold  ">
                ${product.oldPrice}
              </span>
            )}
            <span className="text-[#884D5D] font-black text-[9px] mb-2 uppercase tracking-[0.2em] bg-[#FDF0F3] px-3 py-1">
              Limited Edition
            </span>
          </div>

          <div className="space-y-10">
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">The Formula</h4>
              <p className="text-[#111] font-bold text-[15px] leading-relaxed mb-6  ">
                {product.description}
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h5 className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-gray-900">STRAIGHT UP:</h5>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  {product.details || "Clean, vegan, and cruelty-free formula. Dermatologist tested for all skin types."}
                </p>
              </div>
              <div>
                <h5 className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-gray-900">THE LOWDOWN:</h5>
                <ul className="list-disc list-inside text-gray-500 text-sm space-y-2 ml-1 font-medium">
                  <li>Helps improve the look of pores in just 1 week.</li>
                  <li>Brightens and evens skin tone.</li>
                  <li>Deeply hydrates for all skin types.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-12">
            <button
              onClick={handleDirectCheckout}
              className="flex-1 bg-black text-white h-[60px] rounded-sm font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 active:scale-[0.97] shadow-2xl  "
            >
              Add to Cart <span className="text-lg">→</span>
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-10 text-gray-300 font-black uppercase tracking-widest text-[9px] hover:text-black transition-colors block text-left"
          >
            ← Back to Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;