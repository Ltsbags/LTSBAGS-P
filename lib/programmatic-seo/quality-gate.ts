import { SeoPage, QualityCheckResult } from './types';

/**
 * Calculates token-based Jaccard similarity between two texts.
 */
export function calculateTextSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;
  
  const tokenize = (str: string) => {
    return new Set(
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
  };

  const setA = tokenize(textA);
  const setB = tokenize(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersection++;
  });

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : Math.round((intersection / union) * 100);
}

/**
 * Checks keyword density to avoid stuffing.
 */
function checkKeywordDensity(text: string, keyword: string): { density: number; isStuffed: boolean } {
  if (!text || !keyword) return { density: 0, isStuffed: false };
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { density: 0, isStuffed: false };

  const kw = keyword.toLowerCase().trim();
  const kwWords = kw.split(/\s+/).length;
  let matches = 0;

  const fullText = text.toLowerCase();
  let pos = 0;
  while ((pos = fullText.indexOf(kw, pos)) !== -1) {
    matches++;
    pos += kw.length;
  }

  const density = (matches * kwWords / words.length) * 100;
  return {
    density: parseFloat(density.toFixed(2)),
    isStuffed: density > 3.8
  };
}

/**
 * Runs 12-point quality assessment on a Programmatic SEO page.
 */
export function evaluatePageQuality(
  page: SeoPage, 
  existingPages: SeoPage[] = []
): QualityCheckResult {
  const passed: string[] = [];
  const failed: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // 1. Title Length & Uniqueness (Max 10 pts)
  if (page.seo_title && page.seo_title.length >= 35 && page.seo_title.length <= 70) {
    passed.push('SEO Title is optimal length (35-70 characters)');
    score += 10;
  } else {
    failed.push('SEO Title is missing or outside optimal length (35-70 chars)');
    recommendations.push('Refine SEO title length to stay within 35 to 70 characters.');
  }

  // 2. Meta Description (Max 10 pts)
  if (page.meta_description && page.meta_description.length >= 100 && page.meta_description.length <= 165) {
    passed.push('Meta description is optimal length (100-165 characters)');
    score += 10;
  } else {
    failed.push('Meta description should be between 100 and 165 characters');
    recommendations.push('Write an informative meta description between 100 and 165 characters.');
  }

  // 3. Unique H1 Header (Max 10 pts)
  if (page.h1 && page.h1.trim().length >= 15) {
    passed.push('H1 header is descriptive and present');
    score += 10;
  } else {
    failed.push('H1 header is too short or missing');
    recommendations.push('Provide a clear, high-intent H1 headline.');
  }

  // 4. Intro Content Depth (Max 15 pts)
  const introWords = page.intro_content?.join(' ').split(/\s+/).length || 0;
  if (introWords >= 120) {
    passed.push(`Introductory content is comprehensive (${introWords} words)`);
    score += 15;
  } else if (introWords >= 60) {
    passed.push(`Introductory content is acceptable (${introWords} words)`);
    score += 8;
  } else {
    failed.push('Introductory content is too thin (<60 words)');
    recommendations.push('Expand introductory content with specific B2B manufacturing context.');
  }

  // 5. Technical Specifications (Max 10 pts)
  if (
    page.specifications &&
    page.specifications.materials?.length > 0 &&
    page.specifications.moq &&
    page.specifications.sample_timeline
  ) {
    passed.push('Technical specifications and commercial terms are complete');
    score += 10;
  } else {
    failed.push('Incomplete technical specifications or commercial terms');
    recommendations.push('Add detailed materials, hardware options, MOQ, and sample timelines.');
  }

  // 6. High-Value FAQs (Max 10 pts)
  if (page.faq && page.faq.length >= 3) {
    passed.push(`Contains ${page.faq.length} detailed B2B buyer FAQs`);
    score += 10;
  } else {
    failed.push('Fewer than 3 FAQs provided');
    recommendations.push('Include at least 3 high-intent buyer questions with truthful answers.');
  }

  // 7. Featured Image & ALT Text (Max 5 pts)
  if (page.featured_image && page.image_alt && page.image_alt.length > 10) {
    passed.push('Featured image and descriptive ALT text present');
    score += 5;
  } else {
    failed.push('Featured image or ALT text is missing');
    recommendations.push('Add high-resolution image with descriptive ALT text.');
  }

  // 8. Canonical URL & Valid Slug (Max 10 pts)
  const expectedCanonical = `https://ltsbags.com/${page.slug}`;
  if (page.canonical_url === expectedCanonical && /^[a-z0-9-]+$/.test(page.slug)) {
    passed.push('Canonical URL matches canonical slug format exactly');
    score += 10;
  } else {
    failed.push('Canonical URL mismatch or slug contains invalid characters');
    recommendations.push('Ensure slug is lowercase hyphenated and canonical matches root URL.');
  }

  // 9. Location Truthfulness Check (Max 10 pts)
  const fullText = (page.intro_content?.join(' ') || '') + ' ' + (page.location_content || '');
  if (page.page_type === 'product_location' || page.location_id) {
    const isMumbai = page.location_id === 'mumbai';
    if (isMumbai) {
      if (fullText.toLowerCase().includes('dharavi') || fullText.toLowerCase().includes('mumbai')) {
        passed.push('Truthfully indicates Mumbai Dharavi manufacturing headquarters');
        score += 10;
      } else {
        failed.push('Missing explicit Dharavi Mumbai factory location mention');
      }
    } else {
      // Non-mumbai city must NOT claim factory is in that city
      const cityMention = page.location_id?.toLowerCase() || '';
      const fakeClaimPatterns = [
        `factory in ${cityMention}`,
        `our ${cityMention} factory`,
        `manufacturing plant in ${cityMention}`
      ];
      const hasFakeClaim = fakeClaimPatterns.some(p => fullText.toLowerCase().includes(p));
      if (!hasFakeClaim) {
        passed.push('Accurately positions Mumbai manufacturing with direct express logistics to client city');
        score += 10;
      } else {
        failed.push(`Violates truthfulness policy: claims a physical factory in ${page.location_id}`);
        recommendations.push(`Remove fake factory claim in ${page.location_id}. State: "Custom bag manufacturing from our Mumbai facility serving buyers in ${page.location_id}."`);
        score = Math.max(0, score - 25);
      }
    }
  } else {
    // Non-location pages get full score for this check
    score += 10;
    passed.push('General manufacturing compliance verified');
  }

  // 10. Keyword Stuffing Check (Max 10 pts)
  const primaryKw = page.h1;
  const kwCheck = checkKeywordDensity(fullText, primaryKw);
  if (!kwCheck.isStuffed) {
    passed.push(`Healthy keyword density (${kwCheck.density}%)`);
    score += 10;
  } else {
    failed.push(`High keyword repetition detected (${kwCheck.density}%)`);
    recommendations.push('Reduce unnatural repetition of the exact target keyword.');
  }

  // 11. Duplicate Content Check & Cannibalization
  let maxSimilarity = 0;
  let mostSimilarSlug = '';
  let cannibalizationSlug: string | undefined = undefined;

  const currentContent = [
    page.seo_title,
    page.h1,
    page.intro_content?.join(' '),
    page.product_overview,
    page.faq?.map(f => f.question + ' ' + f.answer).join(' ')
  ].join(' ');

  for (const other of existingPages) {
    if (other.id === page.id) continue;
    
    // Check cannibalization (identical primary keyword/intent)
    if (
      other.h1.toLowerCase().trim() === page.h1.toLowerCase().trim() ||
      other.slug.toLowerCase().trim() === page.slug.toLowerCase().trim()
    ) {
      cannibalizationSlug = other.slug;
    }

    const otherContent = [
      other.seo_title,
      other.h1,
      other.intro_content?.join(' '),
      other.product_overview,
      other.faq?.map(f => f.question + ' ' + f.answer).join(' ')
    ].join(' ');

    const sim = calculateTextSimilarity(currentContent, otherContent);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      mostSimilarSlug = other.slug;
    }
  }

  let duplicateRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' = 'NONE';
  if (maxSimilarity >= 65) {
    duplicateRisk = 'HIGH';
    failed.push(`High content similarity (${maxSimilarity}%) with /${mostSimilarSlug}`);
    recommendations.push(`Differentiate content from /${mostSimilarSlug}. Minimum 40-60% of content must be unique.`);
    score = Math.max(0, score - 20);
  } else if (maxSimilarity >= 45) {
    duplicateRisk = 'MEDIUM';
    recommendations.push(`Moderate similarity (${maxSimilarity}%) with /${mostSimilarSlug}. Add more specialized domain copy.`);
  } else if (maxSimilarity >= 25) {
    duplicateRisk = 'LOW';
    passed.push(`Low similarity with other pages (Max: ${maxSimilarity}%)`);
  } else {
    passed.push('High content uniqueness across index');
  }

  if (cannibalizationSlug) {
    failed.push(`Cannibalization warning: conflicts with /${cannibalizationSlug}`);
    recommendations.push(`Page target intent cannibalizes existing page /${cannibalizationSlug}. Consider consolidating.`);
    score = Math.max(0, score - 30);
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const isIndexable = finalScore >= 70 && duplicateRisk !== 'HIGH' && !cannibalizationSlug;

  return {
    page_id: page.id,
    slug: page.slug,
    score: finalScore,
    is_indexable: isIndexable,
    passed_checks: passed,
    failed_checks: failed,
    duplicate_risk: duplicateRisk,
    cannibalization_with: cannibalizationSlug,
    recommendations
  };
}
