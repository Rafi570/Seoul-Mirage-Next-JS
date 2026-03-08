"use client";

import React, { useEffect, useState, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const OrderHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.email) {
        try {
          const res = await axiosInstance.get(`/api/orders/user/${user.email}`);
          setOrders(res.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user, axiosInstance]);

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const selectedSubtotal = orders
    .filter((order) => selectedOrders.includes(order._id))
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const shipping = selectedOrders.length > 0 ? 5.99 : 0;
  const finalTotal = selectedSubtotal + shipping;

  const handleProceedToPay = () => {
    const ordersToPay = orders.filter((order) =>
      selectedOrders.includes(order._id),
    );

    const checkoutData = {
      selectedOrders: ordersToPay,
      totalPayable: finalTotal,
    };
    sessionStorage.setItem("checkout_data", JSON.stringify(checkoutData));
    router.push("/process-pay");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="animate-pulse text-lg font-medium text-gray-400  ">
          Loading Seoul Mirage...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F2EADA] py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[42px] font-normal text-[#111] mb-12   uppercase tracking-tighter">
          Order Selection
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-10 text-center   text-gray-400 border border-gray-100">
                No orders found in your history.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className={`relative group flex gap-6 p-6 border transition-all duration-500 ${
                    selectedOrders.includes(order._id)
                      ? "bg-white border-black shadow-xl"
                      : "bg-white/60 border-gray-100 opacity-80"
                  }`}
                >
                  {order.status === "Unpaid" && (
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                        className="w-5 h-5 accent-black cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        ID: #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                          order.status === "Unpaid"
                            ? "bg-red-50 text-red-500"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center mb-3">
                        <img
                          src={item.image}
                          className="w-16 h-16 object-cover bg-gray-50 border border-gray-100"
                          alt={item.name}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold  ">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <p className="font-black text-sm  ">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="w-full lg:w-[380px]">
            <div className="bg-[#F5F0E9] p-8 sticky top-28 rounded-sm border border-[#E5DFD5]">
              <h2 className="text-xl font-black mb-8   uppercase tracking-tight">
                Payment Summary
              </h2>
              <div className="space-y-4 border-b border-[#E5DFD5] pb-6">
                <div className="flex justify-between text-[11px] font-bold uppercase text-gray-500">
                  <span>Selected Orders ({selectedOrders.length})</span>
                  <span className="text-black">
                    ${selectedSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase text-gray-500">
                  <span>Estimated Shipping</span>
                  <span className="text-black">${shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between py-6">
                <span className="text-lg font-black uppercase  ">
                  Total
                </span>
                <span className="text-2xl font-black   tracking-tighter">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleProceedToPay}
                disabled={selectedOrders.length === 0}
                className={`w-full py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all ${
                  selectedOrders.length > 0
                    ? "bg-black text-white  shadow-2xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
