"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import c1 from "../../../assets/img/contact1.png"; 
import c2 from "@/assets/img/contact2.png";
import JoinCom from '@/components/home/JoinCom';

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "What is your return policy?", a: "Figma ipsum component variant main layer. Line ellipse object list undo rectangle duplicate editor distribute overflow Arrow pen union device share scrolling style." },
    { q: "Are your products cruelty-free?", a: "Yes, all Seoul Mirage products are 100% cruelty-free and dermatologically tested." },
    { q: "How long does international shipping take?", a: "International shipping typically takes 7-14 business days depending on your location." },
    { q: "Do you offer wholesale opportunities?", a: "Yes, please contact us via email for wholesale inquiries and bulk pricing." },
    { q: "Can I change my order after it's placed?", a: "Orders can be modified within 2 hours of placement. Please contact our support team immediately." },
    { q: "Is Seoul Mirage available in stores?", a: "Currently, we are exclusively online to ensure the best pricing for our premium products." },
  ];

  return (
    <div className="bg-white font-sans">
      {/* SECTION 1: Get in Touch */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 w-full">
          <h1 className="text-[48px] font-bold text-[#333] mb-6">Contact Us</h1>
          <h2 className="text-[20px] font-bold text-[#333] mb-2">Get in Touch</h2>
          <p className="text-[#666] text-sm mb-10 leading-relaxed max-w-[450px]">
            Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.
          </p>

          <form className="space-y-6 max-w-[500px]">
            <div>
              <label className="text-[12px] text-gray-500 mb-2 block font-medium">Name</label>
              <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none rounded-sm" placeholder="Your Name" />
            </div>
            <div>
              <label className="text-[12px] text-gray-500 mb-2 block font-medium">Email</label>
              <input type="email" className="w-full border border-gray-300 p-3 focus:outline-none rounded-sm" placeholder="Email Address" />
            </div>
            <div>
              <label className="text-[12px] text-gray-500 mb-2 block font-medium">How can we help</label>
              <textarea rows="4" className="w-full border border-gray-300 p-3 focus:outline-none rounded-sm resize-none" placeholder="Your message..."></textarea>
            </div>
            <button type="button" className="px-10 py-3 border border-gray-800 text-[12px] rounded-full hover:bg-gray-800 hover:text-white transition-all font-medium uppercase tracking-wider">
              Let Us Know
            </button>
          </form>
        </div>

        <div className="flex-1 w-full h-[600px] relative">
          <Image 
            src={c1}
            alt="Contact Seoul Mirage" 
            fill
            className="object-cover rounded-sm shadow-sm"
            priority 
          />
        </div>
      </div>

      <div className="bg-[#F5E1C9] py-20 px-6 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-[24px] font-bold mb-12 text-[#333]">Other Ways to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-gray-700 mt-1" />
              <div>
                <h3 className="font-bold text-[18px]">Email</h3>
                <p className="text-gray-600">seoulmirage@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-gray-700 mt-1" />
              <div>
                <h3 className="font-bold text-[18px]">Phone</h3>
                <p className="text-gray-600">+82 2 123 4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-gray-700 mt-1" />
              <div>
                <h3 className="font-bold text-[18px]">Address</h3>
                <p className="text-gray-600 italic">123 Beauty Lane, Gangnam, Seoul, South Korea</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-24 flex flex-col md:flex-row gap-16">
        <div className="flex-1 h-[700px] relative">
          <Image 
            src={c2} 
            alt="Skin Care Questions" 
            fill
            className="object-cover rounded-sm"
          />
        </div>
        
        <div className="flex-1 w-full">
          <h2 className="text-[32px] font-bold text-[#333] mb-4 italic">Frequently Asked Questions</h2>
          <p className="text-gray-500 mb-10 text-sm">Find answers to our most commonly asked questions. If you can't find what you're looking for, please contact us.</p>
          
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full py-6 flex justify-between items-center text-left hover:text-gray-600 transition-colors focus:outline-none"
                >
                  <span className="font-bold text-[16px] text-[#333]">{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="w-5 h-5 transition-transform" /> : <ChevronDown className="w-5 h-5 transition-transform" />}
                </button>
                {openFaq === index && (
                  <div className="pb-8 text-gray-500 text-sm leading-relaxed transition-all duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <JoinCom />
    </div>
  );
};

export default ContactPage;