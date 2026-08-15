import SEO from '@/components/seo/SEO';
import PremiumServices from '@/components/services/PremiumServices';
import { SERVICES } from '@/constants';

export default function Services() {
  return (
    <>
      <SEO
        title="Our Services | ATIDETO"
        description="Explore ATIDETO's premium services: software products, AI automation, cloud infrastructure, data systems, and UI/UX design."
        url="https://atideto.in/services"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://atideto.in/' },
                { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://atideto.in/services' },
              ],
            },
            ...SERVICES.map((service) => ({
              '@type': 'Service',
              name: service.title,
              description: service.description,
              provider: { '@type': 'LocalBusiness', '@id': 'https://atideto.in/#organization', name: 'ATIDETO' },
            })),
          ],
        }}
      />
      <PremiumServices />
    </>
  );
}
