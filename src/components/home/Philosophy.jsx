import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/shared/Container'
import { Button } from '@/components/ui/button'

// Assets
import philosophyImg from '@/assets/img/Our Skincare Philosophy.png'

export default function Philosophy() {
  return (
    <section className="w-full bg-[#F2EADA] overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row min-h-[600px] items-stretch">

          {/* LEFT CONTENT */}
          <div className="w-full lg:w-1/2 flex items-center py-16 lg:py-24">
            <div className="max-w-xl">
              <h2 className="philosophy-title">
                Our Skincare Philosophy
              </h2>

              <div className="space-y-6 mt-6">
                <p className="philosophy-desc">
                  Seoul Mirage was born from a deep appreciation for Korean skincare innovation
                  and the belief that effective products should be accessible to everyone.
                </p>

                <p className="philosophy-desc">
                  We combine time-tested Korean ingredients with modern science to create
                  formulations that deliver visible results. Each product is meticulously
                  crafted to honor the tradition of the multi-step skincare ritual while
                  fitting seamlessly into your daily routine.
                </p>
              </div>

              <div className="pt-10">
                <Button
                  asChild
                  className="rounded-full px-12 h-14 bg-white text-black hover:bg-slate-50 shadow-md text-lg"
                >
                  <Link href="/about">About Us</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE — DESKTOP ONLY */}
          <div className="hidden lg:block w-1/2 relative">
            <Image
              src={philosophyImg}
              alt="Skincare Philosophy Products"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

        </div>

        {/* MOBILE IMAGE */}
        <div className="lg:hidden w-full h-[350px] relative rounded-2xl overflow-hidden mb-12">
          <Image
            src={philosophyImg}
            alt="Skincare Philosophy Products"
            fill
            className="object-cover"
          />
        </div>

      </Container>
    </section>
  )
}