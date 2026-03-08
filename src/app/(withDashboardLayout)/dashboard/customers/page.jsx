"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  ShieldCheck,
  ShieldAlert,
  Users,
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext"; 
import { useRouter } from "next/navigation"; 
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
import Image from "next/image";

const CustomersPage = () => {
  const {
    user: currentUser,
    logout,
    loading: authLoading,
  } = useContext(AuthContext);
  const router = useRouter();
  const axiosInstance = useAxios();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // --- ১. ADMIN ACCESS CHECK ---
  useEffect(() => {
    const verifyAccess = async () => {
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
              Swal.fire("Access Denied", "Admin access only!", "error");
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
    verifyAccess();
  }, [currentUser, authLoading, router, logout, axiosInstance]);

  // --- ২. FETCH USERS WITH SEARCH ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/auth/users?search=${searchTerm}`,
      );
      setUsers(res.data.users || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      const delayDebounceFn = setTimeout(() => {
        fetchUsers();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, isAdmin]);

  // --- ৩. ROLE UPDATE ---
  const handleRoleUpdate = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    Swal.fire({
      title: "Update Role?",
      text: `Set this user as ${newRole.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      confirmButtonText: "Yes, Update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/api/auth/update-role/${id}`, {
            role: newRole,
          });
          setUsers((prev) =>
            prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
          );
          Swal.fire("Success", "Role updated!", "success");
        } catch (err) {
          Swal.fire("Error", "Failed to update", "error");
        }
      }
    });
  };

  // Pagination Calculation
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (authLoading || (currentUser && !isAdmin)) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#CCAF91]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 md:p-10 border border-gray-100 shadow-sm gap-6">
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <Users size={28} strokeWidth={3} /> User Directory
          </h2>
          <p className="text-[10px] text-[#A38A6F] font-bold uppercase tracking-[0.2em] mt-1">
            Found {users.length} registered members
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="SEARCH NAME OR EMAIL..."
            className="w-full bg-[#FDFBF9] border-b-2 border-gray-100 py-4 pl-12 pr-4 text-[11px] font-black outline-none focus:border-black transition-all uppercase tracking-[0.1em]"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-[#FEF4EC] border-b border-[#EBE3D9]">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Member
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Contact Info
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Joined
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Status
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">
                  Access Control
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-gray-200"
                      size={30}
                    />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest"
                  >
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                currentUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-50 hover:bg-[#FDFBF9] transition-colors group"
                  >
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 border flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white transition-all overflow-hidden relative">
                        {u.image ? (
                          <Image
                            src={u.image}
                            alt={u.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-sm text-gray-900 tracking-tight">
                          {u.name}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                          UID: {u._id?.slice(-8)}
                        </p>
                      </div>
                    </td>
                    <td className="p-6 text-[11px] font-bold text-gray-500 lowercase">
                      {u.email}
                    </td>
                    <td className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {u.role === "admin" ? (
                          <ShieldCheck size={14} className="text-black" />
                        ) : (
                          <ShieldAlert size={14} className="text-gray-300" />
                        )}
                        <span
                          className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                            u.role === "admin"
                              ? "bg-black text-white shadow-lg shadow-black/10"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleRoleUpdate(u._id, u.role)}
                        disabled={u.email === currentUser?.email}
                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 transition-all border-2 ${
                          u.role === "admin"
                            ? "text-red-500 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500"
                            : "text-black border-black hover:bg-black hover:text-white"
                        } disabled:opacity-20 cursor-pointer`}
                      >
                        {u.role === "admin" ? "Revoke" : "Promote"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 flex flex-col sm:flex-row justify-between items-center bg-white border-t border-gray-50 gap-4">
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">
            Showing page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-3 border-2 border-gray-100 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-10 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-3 border-2 border-gray-100 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-10 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
