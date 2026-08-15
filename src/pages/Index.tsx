import SEO from '@/components/seo/SEO';
import PremiumLanding from '@/components/home/PremiumLanding';
import { generateLocalBusinessSchema, generateOrganizationSchema } from '@/lib/schemaUtils';

export default function Index() {
  return (
    <>
      <SEO
        title="ATIDETO | Premium Software, Web, Mobile & AI Solutions in Tamil Nadu"
        description="ATIDETO designs intelligent software, AI automation, premium web experiences, mobile applications, cloud solutions, and scalable digital platforms."
        url="https://atideto.in/"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            generateLocalBusinessSchema('Salem'),
            generateOrganizationSchema(),
            {
              '@type': 'WebSite',
              '@id': 'https://atideto.in/#website',
              url: 'https://atideto.in',
              name: 'ATIDETO',
              publisher: { '@id': 'https://atideto.in/#organization' },
            },
          ],
        }}
      />
      <PremiumLanding />
    </>
  );
}
