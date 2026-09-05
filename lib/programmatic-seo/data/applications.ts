import { SeoApplication } from '../types';

export const SEO_APPLICATIONS: SeoApplication[] = [
  {
    id: 'employee-onboarding',
    name: 'Corporate Employee Onboarding Kits',
    slug: 'employee-onboarding',
    description: 'Turnkey customized laptop bags and welcome packs provided to new hires across IT firms, financial consultancies, and modern startups.',
    popular_bag_types: ['Tech Backpack with Laptop Sleeve', 'Executive Briefcase', 'Cable Organizer Pouch'],
    buyer_types: ['HR Directors', 'People Operations Managers', 'Corporate Procurement Heads', 'Admin Executives'],
    key_features: ['Ergonomic back padding', 'Drop-proof laptop protection', 'Sleek company logo placement', 'Matching stationery compartments']
  },
  {
    id: 'school-uniforms',
    name: 'School & College Uniform Supply',
    slug: 'school-uniforms',
    description: 'Bulk production of custom branded school bags aligned with institutional uniform color codes and student postural health guidelines.',
    popular_bag_types: ['Reinforced Dual-Pocket School Bag', 'Campus Tech Rucksack', 'Gym Shoe Tote'],
    buyer_types: ['School Principals', 'Trustees & Management Boards', 'Uniform Retail Contractors', 'Educational Foundations'],
    key_features: ['Spinal lumbar support', 'Double-stitched stress points', 'Reflective night piping', 'Institutional emblem printing']
  },
  {
    id: 'corporate-gifting',
    name: 'Corporate Gifting & Festivities',
    slug: 'corporate-gifting',
    description: 'High-perceived-value custom bags engineered for Diwali gifts, annual dealer meets, shareholder gifts, and executive appreciation.',
    popular_bag_types: ['Vegan Leather Tech Duffel', 'Matte Ballistic Backpack', 'Premium Canvas Holdall'],
    buyer_types: ['Marketing VPs', 'Corporate Communications Heads', 'Gifting Aggregators', 'Dealer Relationship Managers'],
    key_features: ['Luxury debossed badging', 'Individual premium gift packaging', 'Custom lining fabric', 'High durability']
  },
  {
    id: 'events-exhibitions',
    name: 'Trade Shows, Conferences & Exhibitions',
    slug: 'events-exhibitions',
    description: 'Delegate bags and attendee tote bags designed for immediate handout at convention center registrations and trade show booth visits.',
    popular_bag_types: ['Organic Cotton Tote Bag', 'Delegate Messenger Bag', 'Laminated Jute Goodie Bag'],
    buyer_types: ['Event Management Companies', 'Exhibition Organizers', 'Conference Secretariat', 'PR & Activation Agencies'],
    key_features: ['Brochure and notebook depth', 'Dual handle durability', 'Large clear logo display', 'Budget-efficient bulk economics']
  },
  {
    id: 'retail-private-label',
    name: 'Private Label Fashion & Retail Lines',
    slug: 'retail-distribution',
    description: 'OEM/ODM production for direct-to-consumer (D2C) brands, boutique lifestyle chains, and luggage retailers requiring custom tech packs and unique silhouettes.',
    popular_bag_types: ['Urban Commuter Backpack', 'Minimalist Canvas Tote', 'Waxed Canvas Weekender'],
    buyer_types: ['Brand Founders', 'Fashion Sourcing Directors', 'Merchandise Planners', 'E-commerce Category Leads'],
    key_features: ['Custom hardware mold casting', 'Woven brand & wash care labels', 'Precision stitch tolerances', 'Barcode hangtag packaging']
  }
];

export function getSeoApplication(idOrSlug: string): SeoApplication | undefined {
  const norm = idOrSlug.toLowerCase().trim();
  return SEO_APPLICATIONS.find((a) => a.id === norm || a.slug === norm);
}
