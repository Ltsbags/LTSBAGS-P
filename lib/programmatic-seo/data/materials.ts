import { SeoMaterial } from '../types';

export const SEO_MATERIALS: SeoMaterial[] = [
  {
    id: 'ballistic-nylon',
    name: '1680D Ballistic Nylon',
    slug: 'ballistic-nylon',
    material_characteristics: 'Ultra-dense basket-weave nylon fabric developed originally for military flak jackets, offering exceptional tear strength, abrasion resistance, and water repellency.',
    typical_bag_applications: ['Premium Executive Laptop Backpacks', 'Tactical Field Gear', 'Heavy-Duty Travel Holdalls', 'High-Spec Tech Briefcases'],
    durability: 'Extreme high-tensile resistance (1200+ N), superior abrasion tolerance (>50,000 rub cycles), waterproof polyurethane inner backing.',
    customization_options: ['Waterproof seam taping', 'High-density embroidery', 'Debossed leatherette accents', 'Matte black metal hardware pairing'],
    advantages: ['Virtually indestructible under daily corporate and travel abuse', 'Structured, high-end professional appearance', 'Naturally repels dirt, stains, and light rain'],
    limitations: ['Higher raw material cost than basic polyester', 'Higher fabric weight per square meter'],
    suitable_products: ['backpacks', 'laptop-bags', 'travel-bags']
  },
  {
    id: 'polyester',
    name: '600D / 900D High-Density Polyester',
    slug: 'polyester',
    material_characteristics: 'Lightweight, cost-effective, and highly versatile synthetic weave with waterproof PVC or PU coating, ideal for vibrant color reproduction and high-volume manufacturing.',
    typical_bag_applications: ['Institutional School Bags', 'Corporate Welcome Backpacks', 'Promotional Event Bags', 'Sports Kit Bags'],
    durability: 'High tensile strength suitable for 10-15 kg loads, UV-resistant yarn dyeing, water-resistant back coating.',
    customization_options: ['Multi-color silk screen printing', 'Sublimation printing on light panels', 'Piping accents', 'PVC rubberized patches'],
    advantages: ['Wide spectrum of Pantone-matched stock fabric colors', 'Cost-effective for high-volume procurement', 'Quick-drying and mildew resistant'],
    limitations: ['Less tactile richness compared to heavyweight natural canvas or leatherette'],
    suitable_products: ['backpacks', 'school-bags', 'corporate-bags', 'duffle-bags']
  },
  {
    id: 'cotton-canvas',
    name: 'Heavyweight Organic Cotton Canvas (10oz - 16oz)',
    slug: 'canvas',
    material_characteristics: 'Natural, biodegradable plain-woven cotton fabric offering exceptional tactile texture, organic warmth, and an eco-friendly aesthetic.',
    typical_bag_applications: ['Retail Brand Tote Bags', 'Art Gallery Shopping Bags', 'Lifestyle Weekender Duffels', 'Boho Backpacks'],
    durability: 'Heavy duck weave provides excellent load-bearing strength (>25 kg with cross-box reinforced stitching), breathable and machine washable.',
    customization_options: ['Azo-free pigment screen printing', 'Digital direct-to-fabric printing', 'Vintage enzyme washing', 'Vegetable-tanned leather handle trims'],
    advantages: ['100% natural, biodegradable, and sustainable', 'Premium organic texture favored by lifestyle and fashion brands', 'High perceived brand value'],
    limitations: ['Absorbs water unless treated with paraffin wax or eco-friendly water repellents'],
    suitable_products: ['tote-bags', 'backpacks', 'duffle-bags']
  },
  {
    id: 'natural-jute',
    name: 'Natural Golden Jute & Juco',
    slug: 'jute',
    material_characteristics: 'Golden bast fiber sourced from natural jute plants, spun into a rugged, biodegradable, carbon-negative textile material.',
    typical_bag_applications: ['Eco-Friendly Corporate Hampers', 'Grocery & Supermarket Shopping Bags', 'Trade Fair Goodie Bags', 'Conference Document Totes'],
    durability: 'High tensile strength with low extensibility; food-grade inner LDPE lamination adds waterproof rigidity and spill protection.',
    customization_options: ['Screen printing with eco pigments', 'Colored natural cotton webbing handles', 'Dyed jute side gussets', 'Interior pocket with zipper'],
    advantages: ['100% biodegradable and recyclable', 'Carbon-negative natural crop', 'Inexpensive bulk eco packaging with high durability'],
    limitations: ['Rougher surface texture compared to finely combed cotton; not suitable for intricate multi-color photographic prints'],
    suitable_products: ['jute-bags', 'tote-bags']
  },
  {
    id: 'pu-leatherette',
    name: 'Premium Vegan PU Leatherette',
    slug: 'pu-leather',
    material_characteristics: 'High-grade polyurethane micro-fiber engineered to replicate the supple hand-feel, grain, and durability of genuine leather without animal cruelty.',
    typical_bag_applications: ['Executive Laptop Briefcases', 'VIP Corporate Gift Bags', 'Luxury Travel Holdalls', 'Conference Folders'],
    durability: 'Hydrolysis-resistant, crack-proof, and flexible across temperature swings; water-resistant and easy to wipe clean.',
    customization_options: ['Blind heat debossing', 'Gold / Silver foil stamping', 'Edge-painted handles', 'Laser engraved metallic brand plates'],
    advantages: ['Luxurious executive finish at a fraction of full-grain leather cost', 'Consistent uniform color and grain across large production runs', 'Cruelty-free vegan compliance'],
    limitations: ['Requires specialized creasing, skiving, and edge-coating machinery for high-end finish'],
    suitable_products: ['laptop-bags', 'corporate-bags', 'travel-bags', 'duffle-bags']
  },
  {
    id: 'rpet-recycled',
    name: 'RPET Recycled Polyester',
    slug: 'rpet',
    material_characteristics: 'Sustainable fabric woven from certified post-consumer recycled plastic water bottles (PET), reducing virgin petroleum usage and greenhouse gas emissions.',
    typical_bag_applications: ['Eco Corporate Onboarding Bags', 'Sustainable Brand Merchandise', 'Green Conference Backpacks'],
    durability: 'Performance matches virgin polyester in tensile strength, water resistance, and colorfastness.',
    customization_options: ['RPET certified woven label and hangtag', 'Eco screen printing', 'Contrast recycled zipper tapes'],
    advantages: ['Supports corporate ESG and sustainability mandates', 'Direct environmental impact metrics (e.g., "diverts 15 plastic bottles per bag")', 'Global Recycled Standard (GRS) traceable'],
    limitations: ['Slightly higher raw yarn cost compared to virgin commodity polyester'],
    suitable_products: ['backpacks', 'tote-bags', 'corporate-bags']
  }
];

export function getSeoMaterial(idOrSlug: string): SeoMaterial | undefined {
  const norm = idOrSlug.toLowerCase().trim();
  return SEO_MATERIALS.find((m) => m.id === norm || m.slug === norm);
}
