"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, User, ShoppingBag, ChevronDown, Menu } from 'lucide-react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"

// Assets
import logo from '../../assets/img/logo.png'

const navLinks = [
  { name: 'Skincare', href: '/skincare', hasDropdown: true },
  { name: 'Collections', href: '/collections', hasDropdown: true },
  { name: 'About', href: '/about', hasDropdown: false },
  { name: 'Contact', href: '/contact', hasDropdown: false },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* --- LEFT SIDE: Mobile Menu & Logo --- */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger (Only visible on small screens) */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-slate-100 rounded-md transition-colors">
                  <Menu className="w-6 h-6 text-slate-700" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Image src={logo} alt="Logo" width={80} height={40} />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-10">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-slate-900 border-b pb-2 flex justify-between items-center"
                    >
                      {link.name}
                      {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - Exact Figma Size */}
          <Link href="/" className="flex-shrink-0">
            <Image 
              src={logo} 
              alt="Seoul Mirage Logo" 
              width={93} 
              height={49} 
              className="object-contain w-[70px] md:w-[93px]" 
            />
          </Link>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-8 ml-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="group flex items-center gap-1 text-[15px] font-medium text-slate-700 hover:text-black transition-colors"
              >
                {link.name}
                {link.hasDropdown && (
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-black transition-transform group-hover:rotate-180" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* --- RIGHT SIDE: Action Icons --- */}
        <div className="flex items-center gap-3 md:gap-6 text-slate-700">
          <button className="hover:text-black transition-colors p-1">
            <Search className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          </button>
          
          {/* User Icon - Desktop Only to keep mobile clean */}
          <button className="hidden sm:block hover:text-black transition-colors p-1">
            <User className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          </button>

          <button className="relative hover:text-black transition-colors p-1">
            <ShoppingBag className="w-5 h-5 md:w-[22px] md:h-[22px]" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}