import Image from 'next/image'
import Container from '@/components/shared/Container'

// ASSETS
import storyImg from '@/assets/img/Our Skincare Philosophy.png'
import journeyImg from '@/assets/img/story1.png'
import philosophyImg from '@/assets/img/our phil.png'
import ingredients1 from '@/assets/img/Group 7.png'
import ingredients2 from '@/assets/img/Group 7.png'

export default function Page() {
  return (
    <main className="w-full bg-white text-slate-900 overflow-hidden">

      {/* ================= OUR STORY ================= */}
      <section className="bg-[#F6ECDC] py-20 lg:py-28">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-6">
              <span className="uppercase tracking-widest text-sm text-slate-500">
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight">
                Our Story
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Seoul Mirage was born from a passion for Korean skincare innovation
                and a commitment to creating luxury products that deliver exceptional results.
              </p>
            </div>

            <div className="relative h-[420px] lg:h-[520px] rounded-[32px] overflow-hidden shadow-xl">
              <Image
                src={storyImg}
                alt="Our Story"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ================= OUR JOURNEY ================= */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[520px] lg:h-[680px] rounded-[32px] overflow-hidden shadow-lg order-2 lg:order-1">
              <Image
                src={journeyImg}
                alt="Our Journey"
                fill
                className="object-cover"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <span className="uppercase tracking-widest text-sm text-slate-500">
                Our Path
              </span>
              <h2 className="text-3xl md:text-4xl xl:text-5xl font-semibold">
                Our Journey
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                <p>
                  Founded in 2018 by skincare enthusiasts and biochemists,
                  Seoul Mirage began as a small laboratory in the heart of Seoul.
                </p>
                <p>
                  From meticulous research to global distribution, our journey
                  reflects an unwavering dedication to purity, efficacy, and luxury.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= OUR PHILOSOPHY ================= */}
      <section className="py-24 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <span className="uppercase tracking-widest text-sm text-slate-500">
                Core Values
              </span>
              <h2 className="text-3xl md:text-4xl xl:text-5xl font-semibold">
                Our Philosophy
              </h2>

              <div className="space-y-10 border-l border-slate-200 pl-8">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Purity</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Clean, gentle ingredients designed to respect every skin type.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Innovation</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Advanced science seamlessly blended with Korean skincare traditions.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Sustainability</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Thoughtfully sourced materials and environmentally responsible practices.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[700px] lg:h-[900px] rounded-[32px] overflow-hidden shadow-2xl">
              <Image
                src={philosophyImg}
                alt="Our Philosophy"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ================= OUR INGREDIENTS ================= */}
      <section className="bg-[#F6ECDC] py-24">
        <Container>
          <div className="text-center mb-20 space-y-4">
            <span className="uppercase tracking-widest text-sm text-slate-500">
              Formulation
            </span>
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-semibold">
              Our Ingredients
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Where nature and science unite to create visible, lasting results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[ 
              { title: 'Botanical Extracts', img: ingredients1 },
              { title: 'Fermented Ingredients', img: ingredients2 },
              { title: 'Scientific Compounds', img: ingredients1 },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-md p-8 rounded-[28px] border border-white/60 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />
                </div>
                <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Carefully selected ingredients formulated for optimal performance and skin health.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

    </main>
  )
}