import { Link } from 'react-router-dom';
import SEO from '@/components/seo/SEO';
import { getAllLocations } from '@/data/locations';
import { MapPin, ArrowRight, Sparkles, Building2, GraduationCap } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/schemaUtils';

export default function LocationsDirectory() {
  const allLocations = getAllLocations();

  const breadcrumbs = [
    { name: "Home", url: "https://www.atideto.in/" },
    { name: "Locations", url: "https://www.atideto.in/locations" }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      generateBreadcrumbSchema(breadcrumbs),
      {
        "@type": "CollectionPage",
        "@id": "https://www.atideto.in/locations#webpage",
        "url": "https://www.atideto.in/locations",
        "name": "Tamil Nadu Service Locations & Regional Tech Hubs | ATIDETO Technologies",
        "description": "Directory of software development, AI automation, and tech academy internship locations served by ATIDETO Technologies across Tamil Nadu."
      }
    ]
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#050505] min-h-screen text-[#0F172A] dark:text-white pt-28 pb-20 font-sans transition-colors duration-300">
      <SEO 
        title="Tamil Nadu Service Locations & Regional Tech Hubs | ATIDETO Technologies"
        description="Explore ATIDETO Technologies software development services and student internship hubs across all 38 districts in Tamil Nadu, including Salem, Chennai, Coimbatore, and Madurai."
        url="https://www.atideto.in/locations"
        keywords="ATIDETO locations, Tamil Nadu software development, Salem IT hubs, Chennai software company, Coimbatore web dev, Madurai ERP systems, Trichy AI automation, Erode business software, Tiruppur tech solutions"
        schema={schema}
      />

      {/* Hero Section */}
      <section className="px-6 lg:px-16 max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2F2FE4]/30 bg-[#2F2FE4]/10 text-[#2F2FE4] text-xs font-bold uppercase tracking-wider mb-6">
          <MapPin size={14} /> Regional Presence · Tamil Nadu
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
          Delivering Digital Excellence <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F2FE4] to-[#7B7BFF]">
            Across All 38 Districts of Tamil Nadu
          </span>
        </h1>
        <p className="text-[#64748B] dark:text-[#94A3B8] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          From our engineering headquarters in Salem, we provide enterprise business solutions (CRM, ERP, Billing, Inventory), custom software, AI automation, and tech academy internships to organizations and students across all 38 districts of Tamil Nadu.
        </p>
      </section>

      {/* Locations Grid */}
      <section className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allLocations.map((loc) => (
            <Link
              key={loc.id}
              to={`/locations/${loc.id}`}
              className="group p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0A0F1D] hover:border-[#2F2FE4] dark:hover:border-[#2F2FE4] hover:shadow-xl hover:shadow-[#2F2FE4]/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2F2FE4]/10 text-[#2F2FE4] flex items-center justify-center font-bold text-xs">
                    <MapPin size={14} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#2F2FE4] transition-colors">
                    View Hub →
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#0F172A] dark:text-white mb-1 group-hover:text-[#2F2FE4] transition-colors">
                  {loc.name}
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 leading-relaxed mb-4">
                  {loc.heroDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#475569] dark:text-[#94A3B8]">
                <span className="inline-flex items-center gap-1">
                  <Building2 size={11} /> IT Solutions
                </span>
                <span className="inline-flex items-center gap-1">
                  <GraduationCap size={11} /> Internships
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
