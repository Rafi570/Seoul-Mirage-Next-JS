"use client";

import React, { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/img/logo.png";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  UserCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { AuthContext } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const navLinks = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/dashboard/products", icon: ShoppingBag },
    { name: "Orders", path: "/dashboard/orders", icon: Truck },
    { name: "Customers", path: "/dashboard/customers", icon: Users },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        router.push("/");
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF9]">
      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] bg-[#FEF4EC] border-r border-[#EBE3D9] 
          transition-transform duration-300 transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:h-screen
        `}
      >
        <div className="flex flex-col h-full pt-12 pb-8 px-8">
          <div className="mb-16 flex flex-col items-center">
            <Link
              href="/"
              className="w-20 h-20 mb-3 hover:opacity-80 transition-opacity relative"
            >
              <Image
                src={logo}
                alt="Seoul Mirage"
                fill
                className="object-contain"
              />
            </Link>
            <h2 className="text-3xl font-serif   text-[#333] text-center">
              Seoul Mirage
            </h2>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#CCAF91] mt-2 font-black">
              Cosmetics Admin
            </p>
          </div>

          <nav className="flex-grow space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-sm transition-all duration-300 group ${
                    isActive
                      ? "bg-black text-white shadow-xl"
                      : "text-[#615E5B] hover:bg-[#F2E8DE]"
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[13px] tracking-wide font-bold uppercase">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-[#EBE3D9]">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-[#CCAF91] text-[#A38A6F] rounded-sm transition-all hover:bg-black hover:text-white hover:border-black active:scale-95"
            >
              <LogOut
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-[70px] md:h-[100px] bg-white border-b border-[#F0F0F0] items-center justify-between px-6 md:px-12 sticky top-0 z-30">
          <div className="md:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2">
              <Menu size={24} />
            </button>
          </div>

          <div className="hidden md:block">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
              Dashboard
            </h1>
            <p className="text-2xl font-black   text-gray-900 mt-1 uppercase tracking-tighter">
              {navLinks.find((l) => l.path === pathname)?.name || "Overview"}
            </p>
          </div>

          <div className="flex items-center gap-6 md:gap-10">
            <div className="flex items-center gap-5 text-gray-400">
              <Search
                size={20}
                className="hover:text-black cursor-pointer transition-colors"
              />
              <div className="relative">
                <Bell
                  size={20}
                  className="hover:text-black cursor-pointer transition-colors"
                />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
            </div>

            <div className="flex items-center gap-4 pl-6 md:pl-10 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-none">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-[#CCAF91] font-bold uppercase tracking-widest mt-1.5">
                  Super Admin
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#FEF4EC] p-0.5 overflow-hidden bg-gray-50 flex items-center justify-center relative">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="profile"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <UserCircle
                    size={40}
                    className="text-gray-200"
                    strokeWidth={1}
                  />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-12 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[45] md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
