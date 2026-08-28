export interface LocationData {
  id: string;
  name: string;
  heroTitle: string;
  heroDescription: string;
  localServices: string[];
  nearbyColleges: string[];
  seoKeywords: string;
}

const baseCities = [
  "Salem", "Chennai", "Coimbatore", "Erode", "Namakkal", "Dharmapuri", 
  "Krishnagiri", "Madurai", "Trichy", "Tiruppur", "Karur", "Vellore", 
  "Hosur", "Tirunelveli", "Kanyakumari", "Thoothukudi", "Villupuram", 
  "Cuddalore", "Kanchipuram", "Thanjavur", "Dindigul", "Ramanathapuram", 
  "Nagapattinam", "Pudukkottai", "Virudhunagar", "Sivagangai", 
  "Perambalur", "Ariyalur", "Nilgiris", "Chengalpattu", "Tiruvannamalai",
  "Ranipet", "Tirupathur", "Theni", "Tenkasi", "Mayiladuthurai",
  "Tiruvarur", "Kallakurichi"
];

// Helper to generate dynamic, pseudo-unique content for SEO
const generateLocationData = (city: string): LocationData => {
  const isITHub = ["Chennai", "Coimbatore", "Madurai", "Trichy"].includes(city);
  const isIndustrial = ["Tiruppur", "Hosur", "Salem", "Erode"].includes(city);
  
  let heroDescription = `ATIDETO empowers businesses in ${city} with premium software development, web applications, and AI automation. We also offer top-tier IT internships and professional training for students in the region.`;
  
  if (isITHub) {
    heroDescription = `As a leading tech destination, ${city} demands cutting-edge solutions. ATIDETO provides Enterprise software, Cloud migration, and Generative AI services to corporations here, while offering premium placements and tech courses.`;
  } else if (isIndustrial) {
    heroDescription = `Driving digital transformation for industries in ${city}, ATIDETO delivers custom ERP solutions, IoT development, and workflow automation to scale your manufacturing or retail business.`;
  }

  return {
    id: city.toLowerCase().replace(/\s+/g, '-'),
    name: city,
    heroTitle: `Premium Tech Services & Academy in ${city}`,
    heroDescription,
    localServices: [
      `Software Development in ${city}`,
      "AI & Automation Solutions",
      "Custom ERP & Business Software",
      "UI/UX Design & Branding",
      `IT Internships in ${city}`,
      "Full Stack Development Courses"
    ],
    nearbyColleges: [
      `Engineering Colleges in ${city}`,
      `Arts and Science Institutions in ${city}`,
      "Tech Universities"
    ],
    seoKeywords: `software development ${city}, web design ${city}, IT internships ${city}, AI company ${city}, programming courses ${city}, ATIDETO ${city}`
  };
};

export const locations: Record<string, LocationData> = baseCities.reduce((acc, city) => {
  const data = generateLocationData(city);
  acc[data.id] = data;
  return acc;
}, {} as Record<string, LocationData>);

export const getAllLocations = () => Object.values(locations);
export const getLocationById = (id: string) => locations[id.toLowerCase()];
