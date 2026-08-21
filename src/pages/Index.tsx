import SEO from '@/components/seo/SEO';
import PremiumLanding from '@/components/home/PremiumLanding';
import { generateLocalBusinessSchema, generateOrganizationSchema } from '@/lib/schemaUtils';

export default function Index() {
  return (
    <>
      <SEO
        title="ATIDETO Technologies | Premium Software, Web, Mobile & AI Solutions"
        description="ATIDETO Technologies designs intelligent software, AI automation, premium web experiences, mobile applications, cloud solutions, and scalable digital platforms in Tamil Nadu."
        url="https://www.atideto.in/"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            generateLocalBusinessSchema('Salem'),
            generateOrganizationSchema(),
            {
              '@type': 'WebSite',
              '@id': 'https://www.atideto.in/#website',
              url: 'https://www.atideto.in',
              name: 'ATIDETO Technologies',
              publisher: { '@id': 'https://www.atideto.in/#organization' },
            },
          ],
        }}
      />
      <PremiumLanding />
    </>
  );
}
