"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import banner1 from '../../assets/img/banner1.png'
import banner2 from '../../assets/img/banner2.png'
import banner3 from '../../assets/img/banner3.png'
import { Button } from "../ui/button"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"

const bannerData = [
  { 
    id: 1, 
    img: banner1, 
    title: "Discover your skin's true potential", 
    desc: "Premium skincare that combines innovation with clean, effective ingredients for all skin types." 
  },
  { 
    id: 2, 
    img: banner2, 
    title: "Radiance Redefined", 
    desc: "Experience the glow with our natural ingredient formula for a healthier look." 
  },
  { 
    id: 3, 
    img: banner3, 
    title: "Modern Beauty Standards", 
    desc: "Empowering your natural beauty with science-backed skincare solutions." 
  }
]

export default function Banner() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {bannerData.map((banner) => (
            <CarouselItem key={banner.id}>
              {/* 70% Viewport Height */}
              <div className="relative h-[80vh] w-full overflow-hidden bg-slate-100">
                
                {/* Professional Image Focus Fix */}
                <Image
                  src={banner.img}
                  alt={banner.title}
                  fill
                  className="object-cover object-[center_5%] md:object-[center_10%]" 
                  // 5% ba 10% vertical position matha katar somvabona bondho korbe
                  priority={banner.id === 1}
                />
                
                {/* Figma Design Full Implementation */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-center">
                  <div className="container mx-auto px-6 md:px-12 lg:px-20">
                    <div className="max-w-3xl space-y-6 text-white">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                        {banner.title}
                      </h1>
                      <p className="text-lg md:text-xl text-slate-100 max-w-lg leading-relaxed">
                        {banner.desc}
                      </p>
                      
                      <div className="flex gap-4 pt-4">
                        <Button 
                          size="lg" 
                          className="rounded-full px-10 h-14 bg-white text-black hover:bg-slate-200 font-semibold"
                        >
                          Shop Now
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="rounded-full px-10 h-14 border-2 border-white text-black hover:bg-white/10 font-semibold"
                        >
                          About Us
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}