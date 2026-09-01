import SEO from '@/components/seo/SEO';
import PremiumLanding from '@/components/home/PremiumLanding';
import {
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateLeadershipSchema,
  generateBrandEntitySchema,
  generateBusinessSolutionsSchema,
} from '@/lib/schemaUtils';

export default function Index() {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBrandEntitySchema(),
      ...generateLeadershipSchema(),
      generateOrganizationSchema(),
      generateLocalBusinessSchema('Salem'),
      {
        '@type': 'WebSite',
        '@id': 'https://www.atideto.in/#website',
        url: 'https://www.atideto.in',
        name: 'ATIDETO Technologies',
        alternateName: ['ATIDETO', 'Atideto', 'Atideto Technologies', 'Atideto Solutions'],
        description: 'ATIDETO Technologies provides enterprise software solutions, AI automation, CRM, ERP, and web & mobile development.',
        publisher: { '@id': 'https://www.atideto.in/#organization' },
      },
      ...generateBusinessSolutionsSchema(),
    ],
  };

  return (
    <>
      <SEO
        title="ATIDETO Technologies – Smarter Systems. Stronger Business | Software & AI Solutions"
<<<<<<< HEAD
        description="ATIDETO Technologies (atideto.in) is an enterprise software and digital solutions company in Salem, Tamil Nadu, led by CEO Vishnu R, Founder Neevas Nagil, and CPO Kiran Patil. Engineering CRM, Billing Systems, ERP, Inventory, School ERP, AI Automation, Web & Mobile Applications."
        keywords="ATIDETO, ATIDETO Technologies, Atideto, atideto.in, Atideto Tech, Atideto Solutions, Atideto Salem, Atideto India, Vishnu CEO Atideto, Vishnu R CEO, Neevas Nagil Founder, Kiran CPO, business solutions, CRM, billing system, ERP, inventory management, school ERP, hotel management, gym management, library management, transport management, supply chain SCM, LMS, SMS, expense management, ecommerce, API management, chit fund software, appointment booking, custom software Salem, AI automation Tamil Nadu"
=======
        description="ATIDETO Technologies (atideto.in) is an enterprise software and digital solutions company in Salem, Tamil Nadu, led by CEO & Founder Vishnu R and CPO Kiran Patil. Engineering CRM, Billing Systems, ERP, Inventory, School ERP, AI Automation, Web & Mobile Applications."
        keywords="ATIDETO, ATIDETO Technologies, Atideto, atideto.in, Atideto Tech, Atideto Solutions, Atideto Salem, Atideto India, Vishnu CEO Atideto, Vishnu R CEO, Kiran CPO, business solutions, CRM, billing system, ERP, inventory management, school ERP, hotel management, gym management, library management, transport management, supply chain SCM, LMS, SMS, expense management, ecommerce, API management, chit fund software, appointment booking, custom software Salem, AI automation Tamil Nadu"
>>>>>>> 9afa06a (2.3)
        url="https://www.atideto.in/"
        geoRegion="IN-TN"
        geoPlacename="Salem, Tamil Nadu, India"
        geoPosition="11.6643;78.1460"
        author="Vishnu R, Chief Executive Officer (CEO) of ATIDETO Technologies"
        schema={homeSchema}
      />
      <PremiumLanding />
    </>
  );
}
