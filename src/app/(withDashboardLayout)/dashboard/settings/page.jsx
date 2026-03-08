"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Lock,
  ShieldCheck,
  Loader2,
  Save,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const SettingsPage = () => {
  const {
    user: currentUser,
    logout,
    loading: authLoading,
  } = useContext(AuthContext);
  const router = useRouter();
  const axiosInstance = useAxios();

  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Form State
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- ১. অ্যাডমিন প্রোটেকশন লজিক ---
  useEffect(() => {
    const checkAccess = async () => {
      if (!authLoading) {
        if (currentUser?.email) {
          try {
            const res = await axiosInstance.get(
              `/api/auth/role?email=${currentUser.email}`
            );
            if (res.data.role === "admin") {
              setIsAdmin(true);
            } else {
              await logout();
              router.push("/");
              Swal.fire("Unauthorized", "Admin access required!", "error");
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
    checkAccess();
  }, [currentUser, authLoading, router, logout, axiosInstance]);

  // --- ২. পাসওয়ার্ড চেঞ্জ হ্যান্ডলার ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // ভ্যালিডেশন
    if (passData.newPassword !== passData.confirmPassword) {
      return Swal.fire("Error", "New passwords do not match!", "error");
    }
    if (passData.newPassword.length < 6) {
      return Swal.fire(
        "Error",
        "Password must be at least 6 characters",
        "warning"
      );
    }

    setSubmitting(true);
    try {
      const response = await axiosInstance.patch(
        "/api/auth/change-password",
        {
          email: currentUser.email,
          oldPassword: passData.oldPassword,
          newPassword: passData.newPassword,
        }
      );

      if (response.data.success) {
        Swal.fire("Success", "Password updated successfully!", "success");
        setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      Swal.fire(
        "Failed",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (currentUser && !isAdmin)) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#CCAF91]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="text-left bg-white p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
          <Lock size={28} strokeWidth={2.5} /> Security Settings
        </h2>
        <p className="text-[10px] text-[#A38A6F] font-bold uppercase tracking-[0.2em] mt-1">
          Manage your administrative credentials
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Info Card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-[#FEF4EC] p-6 border border-[#EBE3D9] rounded-sm">
            <ShieldCheck className="text-black mb-3" size={32} />
            <h3 className="text-xs font-black uppercase tracking-widest text-black">
              Admin Identity
            </h3>
            <p className="text-[11px] font-bold text-gray-500 mt-2 break-all">
              {currentUser?.email}
            </p>
            <div className="mt-4 pt-4 border-t border-[#EBE3D9]">
              <span className="bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest">
                Authorized
              </span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed p-2 text-left">
            Note: Changing your password will affect all active sessions. Please
            keep your credentials secure.
          </p>
        </div>

        {/* Right: Password Form */}
        <div className="md:col-span-2 bg-white border border-gray-100 p-8 shadow-sm">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <KeyRound size={18} className="text-gray-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">
                Change Password
              </h3>
            </div>

            {/* Old Password */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passData.oldPassword}
                onChange={(e) =>
                  setPassData({ ...passData, oldPassword: e.target.value })
                }
                className="w-full bg-gray-50 border-b-2 border-gray-100 py-3 px-4 text-sm font-bold outline-none focus:border-black transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* New Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={passData.newPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, newPassword: e.target.value })
                    }
                    className="w-full bg-gray-50 border-b-2 border-gray-100 py-3 px-4 text-sm font-bold outline-none focus:border-black transition-all"
                    placeholder="MIN 6 CHARS"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black cursor-pointer"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passData.confirmPassword}
                  onChange={(e) =>
                    setPassData({
                      ...passData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border-b-2 border-gray-100 py-3 px-4 text-sm font-bold outline-none focus:border-black transition-all"
                  placeholder="RE-TYPE NEW"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 text-left">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Update Security
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;