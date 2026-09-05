import { SeoLeadEvent } from './types';
import fs from 'fs';
import path from 'path';
import { saveDocToFirestore } from '../firestore-sync';

const DATA_DIR = path.join(process.cwd(), '.data');
const LEADS_FILE = path.join(DATA_DIR, 'seo-leads.json');

export function logSeoLeadEvent(event: Omit<SeoLeadEvent, 'id' | 'timestamp'>): SeoLeadEvent {
  const newEvent: SeoLeadEvent = {
    ...event,
    id: `lead-evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let existing: SeoLeadEvent[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      try {
        const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
        existing = JSON.parse(raw);
        if (!Array.isArray(existing)) existing = [];
      } catch (e) {
        existing = [];
      }
    }

    existing.unshift(newEvent);
    // Keep last 1000 events
    if (existing.length > 1000) {
      existing = existing.slice(0, 1000);
    }

    fs.writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    saveDocToFirestore('seo_lead_events', newEvent.id!, newEvent);
  } catch (err) {
    console.error('Error logging SEO lead event', err);
  }

  return newEvent;
}

export function getSeoLeadEvents(limit = 100): SeoLeadEvent[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, limit) : [];
    }
  } catch (err) {
    console.error('Error reading SEO lead events', err);
  }
  return [];
}
