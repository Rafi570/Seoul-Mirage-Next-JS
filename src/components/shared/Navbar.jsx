"use client"

import React, { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  Loader2,
  UserCircle,
} from "lucide-react";

// Assets
import logo from "../../assets/img/logo.png";
import axios from "axios";
import { AuthContext } from "../../../src/contexts/AuthContext";

const navLinks = [
  { name: "Skincare", href: "/#", hasDropdown: true },
  { name: "Collections", href: "/collections", hasDropdown: true },
  { name: "About", href: "/about", hasDropdown: false },
  { name: "Contact", href: "/contact", hasDropdown: false },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const userMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();

  // Fetch User Role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(
            `https://seoul-sage.vercel.app/api/auth/role?email=${user.email}`
          );
          if (res.data.success) setUserRole(res.data.role);
        } catch (err) {
          setUserRole("user");
        }
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, [user]);

  // Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const res = await axios.get(
            `https://seoul-sage.vercel.app/api/products?q=${searchQuery}`
          );
          const data = Array.isArray(res.data) ? res.data : res.data.data || [];
          setSearchResults(data);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click Outside Logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target))
        setShowUserMenu(false);
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setUserRole(null);
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-[1000] w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 font-sans">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 h-20 flex items-center justify-between relative">
          
          {/* LEFT SIDE */}
          <div className={`flex items-center gap-4 md:gap-6 transition-all duration-300 ${isSearchOpen ? "w-0 opacity-0 overflow-hidden md:w-auto md:opacity-100" : "w-auto opacity-100"}`}>
            <button className="lg:hidden p-2 hover:bg-slate-50 rounded-full" onClick={() => setIsOpen(true)}>
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
            <Link href="/" className="flex-shrink-0">
              <Image src={logo} alt="Logo" width={100} height={50} priority className="w-[85px] md:w-[100px] object-contain" />
            </Link>
            <div className="hidden lg:flex items-center gap-10 ml-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[14px] font-semibold text-slate-600 hover:text-black transition-all uppercase tracking-widest">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE & SEARCH */}
          <div className="flex items-center gap-1.5 md:gap-4 flex-1 justify-end" ref={searchContainerRef}>
            <div className={`flex items-center bg-slate-50 rounded-full transition-all duration-500 overflow-hidden ${isSearchOpen ? "flex-1 md:flex-none md:w-[350px] px-4 py-1.5 ring-1 ring-slate-200 ml-4" : "w-0 opacity-0"}`}>
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none w-full px-3 text-sm font-medium text-slate-700 h-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
              {isSearching ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : searchQuery && <X className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setSearchQuery("")} />}
            </div>

            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2.5 rounded-full transition-colors ${isSearchOpen ? "bg-black text-white ml-2" : "hover:bg-slate-50 text-slate-700"}`}>
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            <div className={`flex items-center gap-1.5 md:gap-4 transition-all duration-300 ${isSearchOpen ? "hidden md:flex" : "flex"}`}>
              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-50 transition-all focus:outline-none">
                  <User className="w-5 h-5 text-slate-700" />
                  {user && <span className="hidden md:block text-[10px] font-black uppercase tracking-tighter">{user.name?.split(" ")[0]}</span>}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 shadow-2xl rounded-sm py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {!user ? (
                      <div className="px-2 space-y-1">
                        <Link href="/login" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Sign In</Link>
                        <Link href="/register" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Sign Up</Link>
                      </div>
                    ) : (
                      <div className="px-2">
                        <div className="px-4 py-2 border-b border-slate-50 mb-2 text-left">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Profile</p>
                          <p className="text-xs font-bold truncate mt-1">{user.email}</p>
                        </div>
                        <Link href="/my-profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"><UserCircle size={16} /> My Profile</Link>
                        
                        {/* অ্যাডমিন হলে ড্যাশবোর্ড দেখাবে */}
                        {userRole === "admin" && (
                          <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-[#CCAF91] hover:bg-slate-50">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                        )}

                        <Link href="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"><Settings size={16} /> Settings</Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 mt-2 border-t border-slate-50 pt-3"><LogOut size={16} /> Logout</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link href="/orders">
                <button className="p-2.5 hover:bg-slate-50 rounded-full text-slate-700">
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Quick Search Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-20 right-0 md:right-8 w-full md:w-[400px] bg-white border border-slate-100 shadow-2xl rounded-sm p-4 animate-in fade-in slide-in-from-top-2 z-[1001]">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 text-left">Quick Results</p>
                <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                  {searchResults.map((item) => (
                    <Link key={item._id} href={`/product/${item._id}`} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-4 group text-left">
                      <div className="w-12 h-14 bg-slate-50 overflow-hidden rounded-sm flex-shrink-0 relative">
                        <Image src={item.mainImage} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black uppercase tracking-tight text-slate-800 truncate">{item.name}</h4>
                        <p className="text-xs font-bold text-[#CCAF91] mt-0.5">${item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-[9999] transition-all duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className={`absolute left-0 top-0 bg-white w-[280px] h-full shadow-2xl p-8 transition-transform duration-500 ease-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full" onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-slate-500" /></button>
          <Image src={logo} alt="Logo" width={80} height={40} className="mb-12" />
          <div className="flex flex-col gap-6 text-left">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-3 flex justify-between items-center hover:text-blue-600">
                {link.name} {link.hasDropdown && <ChevronDown className="w-5 h-5 text-slate-400" />}
              </Link>
            ))}
            
            {/* মোবাইল মেনুতে ড্যাশবোর্ড */}
            {userRole === "admin" && (
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-xl font-bold text-[#CCAF91] border-b border-slate-50 pb-3 flex justify-between items-center group">
                Dashboard <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            )}

            {user && <Link href="/my-profile" onClick={() => setIsOpen(false)} className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-3 flex justify-between items-center">My Profile <UserCircle className="w-5 h-5 text-slate-400" /></Link>}
            <Link href="/settings" onClick={() => setIsOpen(false)} className="text-xl font-bold text-slate-600 border-b border-slate-50 pb-3">Settings</Link>
          </div>
          <div className="mt-auto pt-8 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Seoul Mirage</p>
          </div>
        </div>
      </div>
    </>
  );
}