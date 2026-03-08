import Footer from "../../components/shared/Footer";
import Navbar from "../../components/shared/Navbar";
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}