"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const axios = useAxios();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords don't match");

    try {
      const res = await axios.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (res.data.success) router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EADA] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <h1 className="text-[38px] font-normal text-[#111] leading-tight">Create your account</h1>
          <p className="text-gray-600 mt-2">
            Or <Link href="/login" className="font-bold underline text-black">sign in to your existing account</Link>
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 shadow-sm rounded-sm">
          {error && <div className="mb-4 text-red-500 text-xs text-center font-bold">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 block mb-1.5">Full name</label>
              <input 
                type="text" 
                required 
                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 block mb-1.5">Email address</label>
              <input type="email" required className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black"
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 block mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  required 
                  className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 block mb-1.5">Confirm password</label>
              <input type="password" required className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>

            <div className="flex items-start gap-3 pt-2 text-[12px] text-gray-500">
              <input type="checkbox" required className="mt-1 accent-black" />
              <p>I agree to the <span className="font-bold text-black underline">Terms of Service</span> and <span className="font-bold text-black underline">Privacy Policy</span></p>
            </div>

            <button type="submit" className="w-full bg-black text-white py-4 font-bold uppercase tracking-[2px] hover:bg-[#222] transition-all">
              Create Account
            </button>
          </form>
        </div>
        <p className="mt-8 text-center text-sm">Already have an account? <Link href="/login" className="font-bold underline text-black">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;