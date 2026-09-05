import fs from 'fs';
import path from 'path';
import { SeoPage, PageStatus, PageType, QualityCheckResult } from './types';
import { INITIAL_PROGRAMMATIC_SEO_PAGES } from './data/initial-pages';
import { evaluatePageQuality } from './quality-gate';
import { saveDocToFirestore, deleteDocFromFirestore } from '../firestore-sync';

const DATA_DIR = path.join(process.cwd(), '.data');
const SEO_FILE = path.join(DATA_DIR, 'seo-pages.json');

function ensureSeoFile(): SeoPage[] {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.error('Failed to create .data dir', e);
    }
  }

  if (!fs.existsSync(SEO_FILE)) {
    // Initialize with curated initial pages
    const initial = [...INITIAL_PROGRAMMATIC_SEO_PAGES];
    // Re-evaluate quality on all initial pages
    const evaluated = initial.map((p) => {
      const q = evaluatePageQuality(p, initial);
      return {
        ...p,
        quality_score: q.score,
        duplicate_score: q.duplicate_risk === 'HIGH' ? 75 : q.duplicate_risk === 'MEDIUM' ? 40 : 10,
        robots_index: q.is_indexable,
        quality_flags: q.failed_checks,
      };
    });

    try {
      fs.writeFileSync(SEO_FILE, JSON.stringify(evaluated, null, 2), 'utf-8');
      // Sync to Firestore in background
      evaluated.forEach((p) => {
        saveDocToFirestore('seo_pages', p.id, p);
      });
    } catch (e) {
      console.error('Failed to write initial seo-pages.json', e);
    }
    return evaluated;
  }

  try {
    const raw = fs.readFileSync(SEO_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading seo-pages.json', e);
    return [...INITIAL_PROGRAMMATIC_SEO_PAGES];
  }
}

function saveSeoData(pages: SeoPage[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SEO_FILE, JSON.stringify(pages, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving seo-pages.json', e);
  }
}

export const seoStorage = {
  getAllPages(): SeoPage[] {
    return ensureSeoFile();
  },

  getPages(filters?: { status?: PageStatus; page_type?: PageType; search?: string }): SeoPage[] {
    let pages = ensureSeoFile();

    if (filters?.status) {
      pages = pages.filter((p) => p.status === filters.status);
    }

    if (filters?.page_type) {
      pages = pages.filter((p) => p.page_type === filters.page_type);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      pages = pages.filter(
        (p) =>
          p.h1.toLowerCase().includes(q) ||
          p.seo_title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.location_id?.toLowerCase().includes(q) ||
          p.industry_id?.toLowerCase().includes(q)
      );
    }

    return pages;
  },

  getPageBySlug(slug: string): SeoPage | undefined {
    const pages = ensureSeoFile();
    const norm = slug.toLowerCase().trim();
    return pages.find((p) => p.slug.toLowerCase().trim() === norm);
  },

  getPageById(id: string): SeoPage | undefined {
    const pages = ensureSeoFile();
    return pages.find((p) => p.id === id);
  },

  savePage(page: SeoPage): SeoPage {
    const pages = ensureSeoFile();
    const index = pages.findIndex((p) => p.id === page.id || p.slug === page.slug);

    // Run quality assessment against all existing pages
    const quality = evaluatePageQuality(page, pages.filter((p) => p.id !== page.id));
    const updatedPage: SeoPage = {
      ...page,
      quality_score: quality.score,
      duplicate_score: quality.duplicate_risk === 'HIGH' ? 80 : quality.duplicate_risk === 'MEDIUM' ? 45 : 10,
      robots_index: quality.is_indexable && page.status === 'PUBLISHED',
      quality_flags: quality.failed_checks,
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      pages[index] = updatedPage;
    } else {
      pages.push(updatedPage);
    }

    saveSeoData(pages);
    saveDocToFirestore('seo_pages', updatedPage.id, updatedPage);
    return updatedPage;
  },

  updateStatus(id: string, status: PageStatus): SeoPage | undefined {
    const pages = ensureSeoFile();
    const page = pages.find((p) => p.id === id);
    if (!page) return undefined;

    page.status = status;
    page.updated_at = new Date().toISOString();
    // If published, check if it meets quality gate to be indexed
    if (status === 'PUBLISHED') {
      const quality = evaluatePageQuality(page, pages.filter((p) => p.id !== page.id));
      page.robots_index = quality.is_indexable;
      page.quality_score = quality.score;
    } else {
      page.robots_index = false; // non-published cannot be indexed
    }

    saveSeoData(pages);
    saveDocToFirestore('seo_pages', page.id, page);
    return page;
  },

  deletePage(id: string): boolean {
    const pages = ensureSeoFile();
    const filtered = pages.filter((p) => p.id !== id);
    if (filtered.length === pages.length) return false;

    saveSeoData(filtered);
    deleteDocFromFirestore('seo_pages', id);
    return true;
  },

  getStats() {
    const pages = ensureSeoFile();
    const total = pages.length;
    const published = pages.filter((p) => p.status === 'PUBLISHED').length;
    const approved = pages.filter((p) => p.status === 'APPROVED').length;
    const review = pages.filter((p) => p.status === 'REVIEW').length;
    const draft = pages.filter((p) => p.status === 'DRAFT').length;
    const indexed = pages.filter((p) => p.status === 'PUBLISHED' && p.robots_index).length;
    const noindexed = pages.filter((p) => !p.robots_index).length;

    const avgScore = total > 0
      ? Math.round(pages.reduce((acc, p) => acc + (p.quality_score || 0), 0) / total)
      : 0;

    const duplicateAlerts = pages.filter((p) => p.duplicate_score >= 60).length;

    return {
      total,
      published,
      approved,
      review,
      draft,
      indexed,
      noindexed,
      avgScore,
      duplicateAlerts,
    };
  },

  runFullAudit(): QualityCheckResult[] {
    const pages = ensureSeoFile();
    const results: QualityCheckResult[] = [];

    pages.forEach((page) => {
      const q = evaluatePageQuality(page, pages.filter((p) => p.id !== page.id));
      results.push(q);
      page.quality_score = q.score;
      page.quality_flags = q.failed_checks;
      if (!q.is_indexable && page.robots_index) {
        page.robots_index = false;
      }
    });

    saveSeoData(pages);
    return results;
  },

  seedInitialCurated() {
    const pages = ensureSeoFile();
    let addedCount = 0;

    INITIAL_PROGRAMMATIC_SEO_PAGES.forEach((initPage) => {
      const exists = pages.some((p) => p.slug === initPage.slug);
      if (!exists) {
        const q = evaluatePageQuality(initPage, pages);
        const toAdd = {
          ...initPage,
          quality_score: q.score,
          robots_index: q.is_indexable,
          quality_flags: q.failed_checks,
        };
        pages.push(toAdd);
        saveDocToFirestore('seo_pages', toAdd.id, toAdd);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      saveSeoData(pages);
    }
    return { addedCount, total: pages.length };
  }
};
