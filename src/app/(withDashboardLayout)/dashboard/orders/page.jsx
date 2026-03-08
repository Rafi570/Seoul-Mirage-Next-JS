"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  ShoppingBag,
  Eye,
  Trash2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Truck,
  CreditCard,
  X,
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
import Image from "next/image";

const OrdersPage = () => {
  const {
    user: currentUser,
    logout,
    loading: authLoading,
  } = useContext(AuthContext);
  const router = useRouter();
  const axiosInstance = useAxios();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ordersPerPage = 8;

  const fetchOrders = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/orders/all");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, axiosInstance]);

  // --- ২. Admin Verification & Initial Load ---
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!authLoading) {
        if (currentUser?.email) {
          try {
            const res = await axiosInstance.get(
              `/api/auth/role?email=${currentUser.email}`,
            );
            if (res.data.role === "admin") {
              setIsAdmin(true);
            } else {
              await logout();
              router.push("/");
              Swal.fire("Unauthorized", "Admin access only!", "error");
            }
          } catch (err) {
            await logout();
            router.push("/");
          }
        } else {
          router.push("/");
        }
      }
    };
    verifyAdmin();
  }, [currentUser, authLoading, router, logout, axiosInstance]);

  // isAdmin ট্রু হলেই কেবল অর্ডার ফেচ হবে
  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, fetchOrders]);

  // --- ৩. Order Actions ---
  const handleCancelOrder = async (orderId) => {
    Swal.fire({
      title: "Cancel Order?",
      text: "Mark this order as Cancelled?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      confirmButtonText: "Yes, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/api/orders/cancel/${orderId}`, {
            role: "admin",
          });
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId ? { ...o, status: "Cancelled" } : o,
            ),
          );
          Swal.fire("Updated", "Order has been cancelled.", "success");
        } catch (err) {
          Swal.fire("Error", "Failed to update status", "error");
        }
      }
    });
  };

  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: "Delete Order?",
      text: "This action is irreversible!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete Now",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/api/orders/delete/${orderId}`, {
            data: { role: "admin" },
          });
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
          Swal.fire("Deleted!", "Order removed from database.", "success");
        } catch (err) {
          Swal.fire("Error", "Delete failed", "error");
        }
      }
    });
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage) || 1;

  if (authLoading || (currentUser && !isAdmin)) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#CCAF91]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-black   uppercase tracking-tighter flex items-center gap-3">
          <Truck size={24} /> Order Management
        </h2>
        <p className="text-[10px] text-[#A38A6F] font-bold uppercase tracking-[0.2em] mt-1">
          Total {orders.length} orders found
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-[#FEF4EC] border-b border-[#EBE3D9]">
              <tr>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  ID
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Customer
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Amount
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                  Status
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center text-gray-300 font-black uppercase text-xs"
                  >
                    Loading Orders...
                  </td>
                </tr>
              ) : currentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center text-gray-400 font-black uppercase text-xs"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-[#FDFBF9] transition-colors"
                  >
                    <td className="p-5 font-black text-[11px] text-gray-300 uppercase">
                      #{order._id?.slice(-8)}
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-sm text-gray-900">
                        {order.shippingAddress?.name || "Guest User"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold lowercase">
                        {order.userEmail}
                      </p>
                    </td>
                    <td className="p-5 font-black   text-sm text-gray-900">
                      ${order.totalAmount || 0}
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                          order.status === "Paid"
                            ? "bg-green-50 text-green-600"
                            : order.status === "Cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {order.status || "Unpaid"}
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-full"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="p-2 bg-gray-50 hover:text-orange-500 transition-all rounded-full"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 bg-gray-50 hover:text-red-600 transition-all rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 flex justify-between items-center bg-white border-t border-gray-50">
          <p className="text-[10px] font-black uppercase text-gray-300">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2 border hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 border hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Order Details Modal --- */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl my-auto p-6 md:p-10 rounded-sm relative shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black border p-1 rounded-full hover:bg-gray-50 transition-all"
            >
              <X size={20} />
            </button>
            <div className="grid md:grid-cols-2 gap-10">
              {/* Left Side: Items */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest border-b pb-4 mb-6 flex items-center gap-2 text-gray-800">
                  <ShoppingBag size={16} /> Order Items (
                  {selectedOrder.items?.length || 0})
                </h3>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-[#FDFBF9] p-4 border border-gray-100 rounded-sm"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 border bg-white p-1">
                        <Image
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[11px] font-black uppercase tracking-tight text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-[#A38A6F] font-bold mt-1 uppercase">
                          Qty: {item.quantity} | ${item.price}
                        </p>
                      </div>
                      <p className="font-black   text-sm text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-5 border-t-2 border-black">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-black">
                      Grand Total
                    </p>
                    <p className="text-3xl font-black   tracking-tighter text-black">
                      ${selectedOrder.totalAmount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Info */}
              <div className="space-y-8 text-left">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-b pb-4 mb-6 flex items-center gap-2 text-gray-800">
                    <Truck size={16} /> Delivery Info
                  </h3>
                  <div className="bg-gray-50 p-5 rounded-sm border border-gray-100 space-y-3">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      Recipient
                    </p>
                    <p className="text-xs font-bold text-gray-800 uppercase">
                      {selectedOrder.shippingAddress?.name || "Guest"}
                    </p>
                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed">
                      {selectedOrder.shippingAddress?.address},{" "}
                      {selectedOrder.shippingAddress?.city}
                      <br />
                      {selectedOrder.shippingAddress?.state} -{" "}
                      {selectedOrder.shippingAddress?.postCode}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-b pb-4 mb-6 flex items-center gap-2 text-gray-800">
                    <CreditCard size={16} /> Payment Status
                  </h3>
                  <div
                    className={`p-5 border-l-4 rounded-sm ${selectedOrder.status === "Paid" ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}
                  >
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Transaction ID
                    </p>
                    <p className="font-mono text-[11px] font-bold text-gray-800 break-all mb-4 uppercase">
                      {selectedOrder.transactionId || "N/A"}
                    </p>
                    <span
                      className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${selectedOrder.status === "Paid" ? "bg-black text-white" : "bg-white text-red-600 border border-red-200"}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
