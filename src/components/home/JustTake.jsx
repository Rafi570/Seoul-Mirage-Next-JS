"use client"

import React from 'react'
import Image from 'next/image'
import Container from '../shared/Container'
import { Star } from 'lucide-react'

import person1 from '../../assets/img/person1.png'
import person2 from '../../assets/img/person2.png'

const testimonials = [
  {
    id: 1,
    name: "Devon Lane",
    image: person1,
    text: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
    rating: 5
  },
  {
    id: 2,
    name: "Devon Lane",
    image: person2,
    text: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
    rating: 5
  }
]

export default function JustTake() {
  return (
    <section className="py-20 bg-white">
      <Container>
        {/* Header Section using Global Classes */}
        <div className="mb-16 space-y-4">
          <p className="text-center text-sm font-semibold text-[#d4a373] tracking-widest uppercase">
            3940+ Happy Users
          </p>
          <h2 className="section-title">Don't just take our words</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {testimonials.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-8 rounded-2xl">
              {/* Image with exact Figma rounding */}
              <div className="relative w-[180px] h-[200px] shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-4 text-center md:text-left">
                <div className="flex justify-center md:justify-start gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#d4a373] text-[#d4a373]" />
                  ))}
                </div>
                <p className="testimonial-text text-slate-600">
                  {item.text}
                </p>
                <h4 className="font-bold text-lg text-slate-900">{item.name}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots (Visual Only) */}
        <div className="flex justify-center gap-2 mt-12">
          <span className="w-3 h-3 rounded-full bg-slate-200"></span>
          <span className="w-3 h-3 rounded-full bg-[#d4a373]"></span>
          <span className="w-3 h-3 rounded-full bg-slate-200"></span>
        </div>
      </Container>
    </section>
  )
}