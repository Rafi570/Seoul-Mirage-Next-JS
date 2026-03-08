import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '../shared/Container'
import { Facebook, Instagram, Globe } from 'lucide-react'

// Assets
import logo from '../../assets/img/logo.png'

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Bestsellers', href: '/bestsellers' },
    { name: 'New Arrivals', href: '/new-arrivals' },
  ],
  about: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping & Returns', href: '/shipping' },
    { name: 'Privacy Policy', href: '/privacy' },
  ]
}

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-16 pb-8 border-t border-slate-100">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Section 1: Logo & Socials */}
          <div className="space-y-6">
            <Image 
              src={logo} 
              alt="Seoul Mirage Logo" 
              width={93} 
              height={49} 
              className="object-contain"
            />
            <p className="text-slate-600 text-sm leading-relaxed max-w-[280px]">
              Lorem ipsum dolor sit amet consectetur. Scelerisque lectus habitasse adipiscing.
            </p>
            <div className="flex gap-4 items-center">
              <Link href="#" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <Globe className="w-5 h-5 text-slate-500 hover:text-[#d4a373]" />
              </Link>
              <Link href="#" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <Facebook className="w-5 h-5 text-slate-500 hover:text-[#d4a373]" />
              </Link>
              <Link href="#" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <Instagram className="w-5 h-5 text-slate-500 hover:text-[#d4a373]" />
              </Link>
            </div>
          </div>

          {/* Section 2: Shop Links */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">Shop</h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 hover:text-black transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: About Links */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">About</h3>
            <ul className="space-y-4">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 hover:text-black transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            © 2026 Seoul Mirage. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}