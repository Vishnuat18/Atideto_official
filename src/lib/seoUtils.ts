export const generateMetaTitle = (pageName: string, city?: string) => {
  const baseName = "ATIDETO";
  if (city) {
    return `${pageName} in ${city} | ${baseName} | Premium Tech Solutions`;
  }
  return `${pageName} | ${baseName} | Premium Software, Web & AI Solutions`;
};

export const generateMetaDescription = (serviceName: string, keywords: string) => {
  return `ATIDETO provides premium ${serviceName} solutions. Our expertise includes ${keywords}. Partner with us for cutting-edge digital transformation.`;
};
