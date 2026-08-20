import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAIProvider } from '@/lib/chat-service';

// In-memory sliding window rate limiter
const ipRequestMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 15; // Limit to 15 requests per minute

  const timestamps = ipRequestMap.get(ip) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return true;
  }

  validTimestamps.push(now);
  ipRequestMap.set(ip, validTimestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate limiting check
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          reply:
            'You are sending messages too quickly. Please wait a minute before sending another question.',
          error: 'Rate limit exceeded',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { action, messages, lead, langCode, langName } = body;

    // Action 1: Submit a chatbot lead/enquiry directly
    if (action === 'submit_lead') {
      if (!lead || !lead.name || (!lead.email && !lead.mobile)) {
        return NextResponse.json(
          { error: 'Customer Name and Email or Mobile Number are required.' },
          { status: 400 }
        );
      }

      const newEnquiry = db.createEnquiry({
        name: lead.name.trim(),
        company: lead.company ? lead.company.trim() : 'N/A',
        email: lead.email ? lead.email.trim() : 'N/A',
        mobile: lead.mobile ? lead.mobile.trim() : 'N/A',
        productRequirement: lead.productRequirement
          ? lead.productRequirement.trim()
          : 'General Custom Bag Enquiry',
        quantity: Number(lead.quantity) || 100,
        message: lead.message
          ? lead.message.trim()
          : 'Submitted via LTS BAGS AI Chatbot',
        source: 'AI_CHATBOT',
      });

      return NextResponse.json({
        success: true,
        message: 'Lead saved successfully to database',
        enquiryId: newEnquiry.id,
      });
    }

    // Action 2: Process AI Chat Message
    const userMessages = Array.isArray(messages) ? messages : [];
    if (userMessages.length === 0) {
      return NextResponse.json(
        { error: 'No chat messages provided' },
        { status: 400 }
      );
    }

    // Fetch Database Knowledge Context
    const products = db.getProducts();
    const categories = db.getCategories();
    const settings = db.getSettings();

    const contact = settings?.contactInfo || {
      companyName: 'LTS BAGS PRIVATE LIMITED',
      tagline: 'Premier OEM/ODM Custom Bag Manufacturer & Global Exporter',
      phone1: '+91 98335 98338',
      phone2: '+91 96199 61971',
      email1: 'info@ltsbags.com',
      email2: 'sales@ltsbags.com',
      factoryAddress:
        'MIDC Industrial Area, Navi Mumbai, Maharashtra, India',
      workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
      gstNumber: '27AAGCL1568H1ZC',
      isoCertificate: 'ISO 9001:2015 Certified',
      socialWhatsapp: '+91 98335 98338',
    };

    const about = settings?.about || {
      headline: 'India’s Leading Wholesale B2B Custom Bag Factory',
      storyContent:
        'With over two decades of manufacturing craftsmanship, LTS BAGS supplies corporate backpacks, travel bags, duffles, promotional totes, and executive luggage globally.',
      missionTitle: 'Quality & Speed',
      missionContent:
        'Deliver high-tensile, durable bags at direct factory rates.',
    };

    // Format Database Products Context
    const productsContext = products
      .map((p, idx) => {
        const specsStr = (p.specifications || [])
          .map((s) => `${s.label}: ${s.value}`)
          .join(', ');
        const featuresStr = (p.features || []).join(', ');
        return `[Product #${idx + 1}]
Name: ${p.name}
Category: ${p.categoryName || 'General'}
MOQ (Minimum Order Quantity): ${p.moq} units
Materials: ${p.materials || 'High-grade polyester/nylon/canvas/leatherette'}
Features: ${featuresStr || 'Heavy duty stitching, ergonomic padding, custom zippers'}
Specifications: ${specsStr || 'Custom sizing & compartmentalization available'}
Short Description: ${p.shortDesc || ''}
Full Description: ${p.fullDesc || ''}
Custom Branding: Logo embroidery, screen printing, rubber badges, laser-etched metal plates.
`;
      })
      .join('\n');

    const categoriesContext = categories
      .map((c) => `- ${c.name}: ${c.description}`)
      .join('\n');

    const systemInstruction = `You are the official B2B AI Sales & Technical Support Specialist for "LTS BAGS PRIVATE LIMITED".
Your mission is to help B2B buyers, procurement officers, corporate gifting leads, brand managers, and exporters with accurate information about custom bag manufacturing, product catalog, specifications, MOQs, materials, custom branding options, and bulk quotation requests.

STRICT ACCURACY RULES (CRITICAL):
1. Use ONLY the provided DATABASE CONTEXT below as your absolute source of truth.
2. DO NOT invent or fabricate product prices, MOQs, specifications, material compositions, lead times, or company addresses not contained in the database context.
3. If a customer asks about a product, price, specification, or custom feature NOT available in the database context, clearly explain that you do not have that specific information in your current catalog, and politely offer to help them submit a custom quotation enquiry to the sales engineering team.
4. Maintain a professional, polite, B2B-tailored tone. Use concise, readable formatting and bullet points where appropriate.

DATABASE CONTEXT:

=== COMPANY DETAILS & CONTACT INFO ===
Company Name: ${contact.companyName || 'LTS BAGS PRIVATE LIMITED'}
Tagline: ${contact.tagline || 'Premier OEM/ODM Custom Bag Manufacturer & Global Exporter'}
Primary Phone: ${contact.phone1 || '+91 98335 98338'}
Secondary Phone: ${contact.phone2 || '+91 96199 61971'}
Sales Email: ${contact.email2 || contact.email1 || 'sales@ltsbags.com'}
Factory Address: ${contact.factoryAddress || 'MIDC Industrial Area, Navi Mumbai, Maharashtra, India'}
Working Hours: ${contact.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}
Certifications: GST: ${contact.gstNumber || '27AAGCL1568H1ZC'} | ${contact.isoCertificate || 'ISO 9001:2015 Certified'}
WhatsApp Support: ${contact.socialWhatsapp || contact.phone1 || '+91 98335 98338'}

=== PRODUCT CATEGORIES (${categories.length} Categories) ===
${categoriesContext}

=== PRODUCT CATALOG (${products.length} Products) ===
${productsContext}

=== FACTORY & MANUFACTURING CAPACITY ===
Headline: ${about.headline}
Story & Heritage: ${about.storyContent}
Mission: ${about.missionContent}
Daily Production Capacity: 10,000+ units per day
Production Workflow: 1. Requirement & CAD Brief -> 2. Physical Sample in 3-5 Days -> 3. Bulk CNC Cutting & Automated Stitching -> 4. 100% QC Inspection & Express Shipping.
Export Enquiries: Full export documentation, door-to-door freight, containerized shipping handled worldwide.

=== QUOTATION LEAD INSTRUCTIONS ===
Whenever the customer requests a price quote, wants to order in bulk, requests a physical sample, or asks to contact sales:
Inform them:
"You can request an instant quotation right here in this chat window by clicking the 'Request Quote' button, or provide your Name, Company Name, Mobile Number, Email, Bag Type, and Quantity!"

=== LANGUAGE INSTRUCTION ===
The customer is browsing the website in language: ${langName || langCode || 'English'} (${langCode || 'en'}).
You MUST reply in ${langName || 'English'} natively. Keep brand names, technical model terms, and phone numbers clear and readable.`;

    // Extract user messages history & last prompt
    const lastUserMessage = userMessages[userMessages.length - 1];
    const promptText =
      typeof lastUserMessage === 'string'
        ? lastUserMessage
        : lastUserMessage.content || lastUserMessage.text || '';

    const historyFormatted = userMessages.map((m: { role?: string; content?: string; text?: string }) => ({
      role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      content: m.content || m.text || '',
    }));

    // Call modular AI service
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback if API key is not configured in environment
      return NextResponse.json({
        reply: `Thank you for reaching out to LTS BAGS PRIVATE LIMITED! Our factory specializes in custom OEM/ODM bag manufacturing. For urgent bulk pricing and custom branding, please call sales at ${contact.phone1} or click "Request Quote" to submit your specifications.`,
      });
    }

    try {
      const aiProvider = getAIProvider();
      const replyText = await aiProvider.generateResponse({
        prompt: promptText,
        systemInstruction: systemInstruction,
        history: historyFormatted,
      });

      return NextResponse.json({ reply: replyText });
    } catch (aiErr) {
      console.error('Gemini API execution error:', aiErr);
      return NextResponse.json(
        {
          reply: `Thank you for your interest in LTS BAGS! We are currently experiencing a brief connection delay with our AI service. You can click "Request Quote" below to leave your requirements or contact our sales team on WhatsApp at ${contact.phone1}.`,
          error: aiErr instanceof Error ? aiErr.message : 'AI Service Error',
        },
        { status: 200 }
      );
    }
  } catch (err: unknown) {
    console.error('Error in chatbot API route:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to process chat message';
    return NextResponse.json(
      {
        reply:
          "I am having trouble connecting right now. Please click 'Request Quote' below to send us your requirements or call direct sales at +91 98335 98338!",
        error: errorMessage,
      },
      { status: 200 }
    );
  }
}
