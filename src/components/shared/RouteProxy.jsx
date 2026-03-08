"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import useAxios from "@/hooks/useAxios";

const RouteProxy = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axios = useAxios();
  const router = useRouter();
  const pathname = usePathname();
  
  const [authorized, setAuthorized] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const privateRoutes = ["/my-profile", "/orders", "/settings", "/process-pay"];
  const adminRoutes = ["/dashboard"];

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading) return;

      const isPrivate = privateRoutes.some(route => pathname.startsWith(route));
      const isAdmin = adminRoutes.some(route => pathname.startsWith(route));

      // ১. লগইন চেক
      if ((isPrivate || isAdmin) && !user) {
        router.push("/login");
        return;
      }

      // ২. এডমিন চেক (সঠিক এপিআই পাথ দিয়ে)
      if (isAdmin && user) {
        try {
          // আপনার সার্ভার ফাইল অনুযায়ী পাথ হবে /api/auth/role
          const res = await axios.get(`/api/auth/role?email=${user.email}`);
          
          if (res.data.success && res.data.role === "admin") {
            setAuthorized(true);
          } else {
            alert("Access Denied! Admins only.");
            router.push("/");
          }
        } catch (err) {
          console.error("Role check failed:", err);
          router.push("/");
        } finally {
          setCheckingRole(false);
        }
      } 
      else if (isPrivate && user) {
        setAuthorized(true);
        setCheckingRole(false);
      }
      else {
        setAuthorized(true);
        setCheckingRole(false);
      }
    };

    checkAccess();
  }, [pathname, user, authLoading, axios, router]);

  if (authLoading || (pathname.startsWith('/dashboard') && checkingRole)) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF9] font-black italic uppercase tracking-widest text-gray-400 animate-pulse">
        Verifying Access...
      </div>
    );
  }

  return authorized ? children : null;
};

export default RouteProxy;