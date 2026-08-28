import SEO from '@/components/seo/SEO';
import PremiumServices from '@/components/services/PremiumServices';
import { SERVICES } from '@/constants';
import { BUSINESS_SOLUTIONS } from '@/data/businessSolutions';
import { generateBusinessSolutionsSchema, generateBrandEntitySchema } from '@/lib/schemaUtils';

export default function Services() {
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBrandEntitySchema(),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.atideto.in/' },
          { '@type': 'ListItem', position: 2, name: 'Services & Business Solutions', item: 'https://www.atideto.in/services' },
        ],
      },
      ...SERVICES.map((service) => ({
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: { '@type': 'Organization', '@id': 'https://www.atideto.in/#organization', name: 'ATIDETO Technologies' },
      })),
      ...generateBusinessSolutionsSchema(),
    ],
  };

  return (
    <>
      <SEO
        title="Custom Software, Business Solutions & AI Systems | ATIDETO Technologies"
        description="Explore ATIDETO Technologies software solutions: CRM, Billing Systems, ERP, Inventory, School ERP, Mobile Apps, Generative AI Automation, and Cloud Infrastructure in Salem, Tamil Nadu."
        keywords="Custom Software, Business Solutions, CRM, ERP, Billing, Inventory Management, School ERP, AI Automation, Web Development, Mobile Apps, ATIDETO Technologies, Salem, Tamil Nadu"
        url="https://www.atideto.in/services"
        schema={servicesSchema}
      />
      <PremiumServices />
    </>
  );
}
