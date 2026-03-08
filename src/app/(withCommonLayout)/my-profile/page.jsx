"use client"

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext"; // আপনার পাথ অনুযায়ী ঠিক করে নিন
import useAxios from "@/hooks/useAxios";
import { User as UserIcon, MapPin, Lock, Camera, Loader2 } from "lucide-react"; 
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxios();
  const [loading, setLoading] = useState({
    profile: false,
    address: false,
    pass: false,
  });

  // States for different forms
  const [profileData, setProfileData] = useState({ name: "", phone: "" });
  const [addressData, setAddressData] = useState({
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || "", phone: user.phone || "" });
      if (user.address) setAddressData(user.address);
    }
  }, [user]);

  const inputStyle =
    "w-full p-3 bg-white border border-gray-300 rounded-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm text-gray-800 placeholder:text-gray-300";

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    try {
      await axios.patch("/api/auth/update-profile", {
        email: user.email,
        name: profileData.name,
        phone: profileData.phone,
      });
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        confirmButtonColor: "#000",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message,
      });
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, address: true });
    try {
      await axios.patch("/api/auth/update-profile", {
        email: user.email,
        address: addressData,
      });
      Swal.fire({
        icon: "success",
        title: "Address Updated",
        confirmButtonColor: "#000",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message,
      });
    } finally {
      setLoading({ ...loading, address: false });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return Swal.fire({ icon: "error", title: "Passwords do not match" });
    }
    setLoading({ ...loading, pass: true });
    try {
      await axios.patch("/api/auth/change-password", {
        email: user.email,
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        confirmButtonColor: "#000",
      });
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message,
      });
    } finally {
      setLoading({ ...loading, pass: false });
    }
  };

  return (
    <div className="bg-[#F2EADA] min-h-screen">
      <div className="max-w-5xl mx-auto py-12 px-6 text-left animate-in fade-in duration-700">
        <h1 className="text-3xl font-medium text-gray-900 mb-8">My Account</h1>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-12">
          <button className="px-6 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <UserIcon size={14} /> Profile
          </button>
          <Link href="/orders">
            <button className="px-6 py-2 border border-black/10 bg-white/50 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-sm">
              Order History
            </button>
          </Link>
        </div>

        {/* User Information */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6">User Information</h2>
          <div className="relative w-32 h-32 mb-8 group">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-full border-2 border-white shadow-md"
              alt="Profile"
            />
            <button className="absolute bottom-1 right-1 p-2 bg-black text-white rounded-full border-2 border-white hover:scale-110 transition-transform shadow-lg">
              <Camera size={14} />
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Full Name</label>
              <input
                type="text"

                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Email (Fixed)</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-3 border border-gray-200 bg-gray-100/50 text-gray-400 outline-none cursor-not-allowed rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Phone</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div className="md:col-span-2 pt-2 text-left">
              <button
                type="submit"
                disabled={loading.profile}
                className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg"
              >
                {loading.profile && <Loader2 size={12} className="animate-spin" />} Update Profile
              </button>
            </div>
          </form>
        </section>

        {/* Shipping Address */}
        <section className="mb-16 pt-12 border-t border-black/5">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin size={20} /> Shipping Address
          </h2>
          <form onSubmit={handleUpdateAddress} className="space-y-6 max-w-4xl">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Apartment, suite, etc.</label>
              <input
                type="text"
                value={addressData.apartment}
                onChange={(e) => setAddressData({ ...addressData, apartment: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">City</label>
                <input
                  type="text"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  className={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">State/Province</label>
                <input
                  type="text"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                  className={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Postal Code</label>
                <input
                  type="text"
                  value={addressData.postalCode}
                  onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                  className={inputStyle}
                />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Country</label>
              <input
                type="text"
                value={addressData.country}
                onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div className="text-left">
              <button
                type="submit"
                disabled={loading.address}
                className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg"
              >
                {loading.address && <Loader2 size={12} className="animate-spin" />} Update Shipping Address
              </button>
            </div>
          </form>
        </section>

        {/* Change Password */}
        <section className="pt-12 border-t border-black/5">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Lock size={20} /> Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Current Password</label>
              <input
                type="password"
                value={passData.oldPassword}
                onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">New Password</label>
              <input
                type="password"
                value={passData.newPassword}
                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Confirm Password</label>
              <input
                type="password"
                value={passData.confirmPassword}
                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div className="md:col-span-3 pt-4 text-left">
              <button
                type="submit"
                disabled={loading.pass}
                className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg"
              >
                {loading.pass && <Loader2 size={12} className="animate-spin" />} Change Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MyProfile;