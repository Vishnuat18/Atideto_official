import { useState, useEffect } from 'react';
import { TESTIMONIALS } from '@/constants';

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = TESTIMONIALS[active];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-tag">Testimonials</div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white" >
            What Our Clients Say
          </h2>
        </div>

        {/* Featured Testimonial */}
        <div
          key={active}
          className="max-w-3xl mx-auto text-center animate-scaleIn"
          style={{ animationDuration: '0.5s' }}
        >
          <div className="testimonial-card rounded-2xl p-10 mb-8">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>

            {/* Quote */}
            <div className="text-4xl text-[#2F2FE4] mb-4" >"</div>
            <p className="text-white text-lg leading-relaxed mb-8 italic">
              {t.content}
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#2F2FE4]/30"
              />
              <div className="text-left">
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-[#AFAFAF] text-sm">{t.role} at {t.company}</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === active
                    ? 'w-8 h-2 bg-[#2F2FE4]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All testimonials mini */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {TESTIMONIALS.map((testimonial, i) => (
            <button
              key={testimonial.id}
              onClick={() => setActive(i)}
              className={`testimonial-card rounded-xl p-5 text-left transition-all duration-300 cursor-pointer ${
                i === active ? 'border-[#2F2FE4]/50 shadow-lg shadow-[#2F2FE4]/10' : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white text-sm font-medium">{testimonial.name}</p>
                  <p className="text-[#AFAFAF] text-xs">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-[#AFAFAF] text-xs line-clamp-3 leading-relaxed">
                {testimonial.content}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
