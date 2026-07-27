import { useParams, Navigate, Link } from 'react-router-dom';
import { getLocationById } from '@/data/locations';
import SEO from '@/components/seo/SEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schemaUtils';
import { generateMetaTitle, generateMetaDescription } from '@/lib/seoUtils';
import { Target, Zap, Shield, ArrowRight, MapPin } from 'lucide-react';

export default function LocationPage() {
  const { city } = useParams<{ city: string }>();
  const locationData = city ? getLocationById(city) : null;

  if (!locationData) {
    return <Navigate to="/404" replace />;
  }

  const { name, heroTitle, heroDescription, localServices, nearbyColleges, seoKeywords } = locationData;

  const breadcrumbs = [
    { name: "Home", url: "https://atideto.in/" },
    { name: "Locations", url: "https://atideto.in/locations" },
    { name, url: `https://atideto.in/locations/${city}` }
  ];

  const faqs = [
    { question: `What IT services does ATIDETO offer in ${name}?`, answer: `We offer custom software development, web & mobile app development, AI automation, and cloud solutions specifically tailored for businesses in ${name}.` },
    { question: `Do you provide internships for college students in ${name}?`, answer: `Yes! We offer hands-on IT internships and professional training programs for students from colleges in and around ${name}.` },
    { question: `How can businesses in ${name} benefit from AI?`, answer: `Our Generative AI and workflow automation services help companies in ${name} reduce costs, streamline operations, and scale efficiently.` }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      generateLocalBusinessSchema(name),
      generateBreadcrumbSchema(breadcrumbs),
      generateFAQSchema(faqs)
    ]
  };

  return (
    <div className="bg-[#050505] min-h-screen relative text-white pt-24 font-sans">
      <SEO 
        title={generateMetaTitle("Software & Tech Internships", name)}
        description={generateMetaDescription("software development and AI", seoKeywords)}
        keywords={seoKeywords}
        url={`https://atideto.in/locations/${city}`}
        schema={schema}
      />
      
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-16 border-b border-[#3B82F6]/20 bg-gradient-to-b from-[#050505] to-[#0A0A10]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6] text-sm font-medium mb-6">
            <MapPin size={16} /> Serving {name}, Tamil Nadu
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
            {heroTitle}
          </h1>
          <p className="text-[#AFAFAF] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            {heroDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/client-connect" className="btn-electric rounded-xl font-semibold px-8 py-4">
              Start a Project in {name}
            </Link>
            <Link to="/academy" className="btn-outline rounded-xl font-semibold px-8 py-4 glass">
              Explore Internships
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Expertise in {name}</h2>
          <p className="text-[#AFAFAF]">Delivering enterprise-grade solutions and education to the local community.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localServices.map((service, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl border border-white/5 hover:border-[#3B82F6]/50 transition-colors">
              <h3 className="text-xl font-bold mb-3">{service}</h3>
              <p className="text-[#AFAFAF] text-sm">We provide tailored {service.toLowerCase()} to help local organizations and individuals thrive.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Students & Academy Section */}
      <section className="py-20 px-6 bg-[#0A0A10] border-t border-[#3B82F6]/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Empowering Students in {name}</h2>
            <p className="text-[#AFAFAF] mb-8 leading-relaxed">
              Are you studying at one of the {nearbyColleges.join(', ')}? Join ATIDETO Academy for real-world project experience.
            </p>
            <ul className="space-y-4 mb-8">
              {['Final Year Projects & Guidance', 'Professional Tech Internships', 'Full Stack & AI Courses'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
                    <Target size={14} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/academy" className="inline-flex items-center gap-2 text-[#3B82F6] font-semibold hover:gap-3 transition-all">
              View Student Programs <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex-1 glass p-10 rounded-3xl border border-[#3B82F6]/20 w-full relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/20 rounded-full blur-[80px]" />
             <h3 className="text-2xl font-bold mb-4 relative z-10">Why Choose Us?</h3>
             <p className="text-[#AFAFAF] relative z-10 mb-6">"ATIDETO transformed how we approach technology in our region. Their software is flawless, and their training programs are exactly what the local industry needs."</p>
             <p className="font-semibold text-white relative z-10">- Local Business Partner, {name}</p>
          </div>
        </div>
      </section>

      {/* Local FAQs */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold mb-2 text-[#3B82F6]">{faq.question}</h3>
              <p className="text-[#AFAFAF]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
