import SEO from '@/components/seo/SEO';
import PremiumServices from '@/components/services/PremiumServices';
import { SERVICES } from '@/constants';

export default function Services() {
  return (
    <>
      <SEO
        title="Custom Software, Web, Mobile & AI Solutions | ATIDETO Technologies"
        description="Explore ATIDETO Technologies software solutions: custom enterprise software, web applications, mobile app development, generative AI automation, and cloud systems in Salem, Tamil Nadu."
        url="https://www.atideto.in/services"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.atideto.in/' },
                { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.atideto.in/services' },
              ],
            },
            ...SERVICES.map((service) => ({
              '@type': 'Service',
              name: service.title,
              description: service.description,
              provider: { '@type': 'LocalBusiness', '@id': 'https://www.atideto.in/#organization', name: 'ATIDETO Technologies' },
            })),
          ],
        }}
      />
      <PremiumServices />
    </>
  );
}
