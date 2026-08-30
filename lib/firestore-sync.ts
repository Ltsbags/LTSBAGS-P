import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { firestoreDb } from './firebase';
import type { 
  DatabaseSchema, 
  Category, 
  Product, 
  Blog, 
  Enquiry, 
  SiteSettings, 
  HeroSlide, 
  Quotation, 
  Payment, 
  MediaAsset, 
  Client, 
  FaqItem, 
  TestimonialItem, 
  NavigationMenuConfig,
  LanguageSettings,
  EntityTranslation,
  AdminUser,
  AuditLog
} from './types';

// Helper to remove undefined values since Firestore rejects them
export function sanitizeForFirestore<T>(obj: T): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      if (value !== undefined) {
        result[key] = sanitizeForFirestore(value);
      }
    }
    return result;
  }
  return obj;
}

// Helper to check if error is a Firestore quota exhaustion
let quotaExceededUntil = 0;

export function isFirestoreQuotaExceeded(): boolean {
  return Date.now() < quotaExceededUntil;
}

function handleFirestoreError(err: any, context: string): void {
  const errMsg = err?.message || String(err);
  const isQuota = 
    err?.code === 'resource-exhausted' || 
    errMsg.toLowerCase().includes('quota') ||
    errMsg.includes('daily read units') ||
    errMsg.includes('Quota limit exceeded');

  if (isQuota) {
    // 30-minute cooldown before attempting Firestore remote calls again
    quotaExceededUntil = Date.now() + 30 * 60 * 1000;
    console.warn(`[Firestore Quota] ${context}: Free tier daily read/write limit reached. App is running smoothly on local storage & disk database.`);
  } else {
    console.info(`[Firestore] ${context}:`, errMsg);
  }
}

// Helper to retry operations on transient offline or network delay
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 400): Promise<T> {
  if (isFirestoreQuotaExceeded()) {
    throw new Error('Firestore quota currently paused');
  }

  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || '';
      const isQuota = 
        err?.code === 'resource-exhausted' || 
        errMsg.toLowerCase().includes('quota') ||
        errMsg.includes('daily read units') ||
        errMsg.includes('Quota limit exceeded');

      if (isQuota) {
        quotaExceededUntil = Date.now() + 30 * 60 * 1000;
        throw err;
      }

      const isOfflineOrNetwork = 
        errMsg.includes('offline') || 
        err?.code === 'unavailable' ||
        err?.code === 'failed-precondition' ||
        errMsg.includes('network');
      
      if (isOfflineOrNetwork && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

let isSyncingFromFirestore = false;
let isInitialized = false;

/**
 * Save an individual document to Firestore
 */
export async function saveDocToFirestore(collectionName: string, docId: string, data: any): Promise<void> {
  if (isFirestoreQuotaExceeded() || !docId) return;
  try {
    const sanitized = sanitizeForFirestore(data);
    const docRef = doc(firestoreDb, collectionName, String(docId));
    await withRetry(() => setDoc(docRef, sanitized, { merge: true }), 1, 300);
  } catch (err: any) {
    handleFirestoreError(err, `Could not save to ${collectionName}/${docId}`);
  }
}

/**
 * Delete an individual document from Firestore
 */
export async function deleteDocFromFirestore(collectionName: string, docId: string): Promise<void> {
  if (isFirestoreQuotaExceeded() || !docId) return;
  try {
    const docRef = doc(firestoreDb, collectionName, String(docId));
    await withRetry(() => deleteDoc(docRef), 1, 300);
  } catch (err: any) {
    handleFirestoreError(err, `Could not delete from ${collectionName}/${docId}`);
  }
}

/**
 * Load all data from Firestore into a DatabaseSchema object
 */
export async function loadAllDataFromFirestore(): Promise<Partial<DatabaseSchema> | null> {
  if (isSyncingFromFirestore || isFirestoreQuotaExceeded()) return null;
  isSyncingFromFirestore = true;

  try {
    const result: Partial<DatabaseSchema> = {};

    // 1. Settings
    try {
      const settingsDoc = await withRetry(() => getDoc(doc(firestoreDb, 'settings', 'global')), 1, 300);
      if (settingsDoc.exists()) {
        result.settings = settingsDoc.data() as SiteSettings;
      }
    } catch (e: any) {
      handleFirestoreError(e, 'Settings fetch');
    }

    // 2. Navigation
    try {
      const navDoc = await withRetry(() => getDoc(doc(firestoreDb, 'navigation', 'main')), 1, 300);
      if (navDoc.exists()) {
        result.navigation = navDoc.data() as NavigationMenuConfig;
      }
    } catch (e: any) {
      handleFirestoreError(e, 'Navigation fetch');
    }

    // 3. Languages
    try {
      const langDoc = await withRetry(() => getDoc(doc(firestoreDb, 'settings', 'languages')), 1, 300);
      if (langDoc.exists()) {
        result.languageSettings = langDoc.data() as LanguageSettings;
      }
    } catch (e: any) {
      handleFirestoreError(e, 'Languages fetch');
    }

    // 4. Collections
    const fetchCollection = async <T>(collName: string): Promise<T[]> => {
      if (isFirestoreQuotaExceeded()) return [];
      try {
        const snap = await withRetry(() => getDocs(collection(firestoreDb, collName)), 1, 300);
        const items: T[] = [];
        snap.forEach((d) => {
          items.push({ ...d.data(), id: d.id } as T);
        });
        return items;
      } catch (err: any) {
        handleFirestoreError(err, `Collection ${collName} fetch`);
        return [];
      }
    };

    const [
      categories,
      products,
      blogs,
      enquiries,
      slides,
      quotations,
      payments,
      media,
      clients,
      faqs,
      testimonials,
    ] = await Promise.all([
      fetchCollection<Category>('categories'),
      fetchCollection<Product>('products'),
      fetchCollection<Blog>('blogs'),
      fetchCollection<Enquiry>('enquiries'),
      fetchCollection<HeroSlide>('slides'),
      fetchCollection<Quotation>('quotations'),
      fetchCollection<Payment>('payments'),
      fetchCollection<MediaAsset>('media'),
      fetchCollection<Client>('clients'),
      fetchCollection<FaqItem>('faqs'),
      fetchCollection<TestimonialItem>('testimonials'),
    ]);

    if (categories.length > 0) result.categories = categories;
    if (products.length > 0) result.products = products;
    if (blogs.length > 0) result.blogs = blogs;
    if (enquiries.length > 0) result.enquiries = enquiries;
    if (slides.length > 0) result.slides = slides;
    if (quotations.length > 0) result.quotations = quotations;
    if (payments.length > 0) result.payments = payments;
    if (media.length > 0) result.media = media;
    if (clients.length > 0) result.clients = clients;
    if (faqs.length > 0) result.faqs = faqs;
    if (testimonials.length > 0) result.testimonials = testimonials;

    // Restore any uploaded images from Firestore to disk in the background (if quota not exceeded)
    if (!isFirestoreQuotaExceeded()) {
      restoreUploadedImagesFromFirestore().catch((err) => {
        handleFirestoreError(err, 'Async image restoration');
      });
    }

    return result;
  } catch (err) {
    handleFirestoreError(err, 'Failed to load full data from Firestore');
    return null;
  } finally {
    isSyncingFromFirestore = false;
  }
}

/**
 * Seed initial data to Firestore if Firestore is empty
 */
export async function seedInitialDataToFirestore(initialData: DatabaseSchema): Promise<void> {
  if (isInitialized || isFirestoreQuotaExceeded()) return;

  try {
    const settingsDoc = await withRetry(() => getDoc(doc(firestoreDb, 'settings', 'global')), 1, 400);
    isInitialized = true;
    if (!settingsDoc.exists() && initialData.settings) {
      console.log('[Firestore] Seeding initial data to Firestore...');
      await setDoc(doc(firestoreDb, 'settings', 'global'), sanitizeForFirestore(initialData.settings));

      if (initialData.navigation) {
        await setDoc(doc(firestoreDb, 'navigation', 'main'), sanitizeForFirestore(initialData.navigation));
      }

      if (initialData.languageSettings) {
        await setDoc(doc(firestoreDb, 'settings', 'languages'), sanitizeForFirestore(initialData.languageSettings));
      }

      // Seed categories in batches
      for (const cat of initialData.categories || []) {
        if (cat.id && !isFirestoreQuotaExceeded()) {
          await saveDocToFirestore('categories', cat.id, cat);
        }
      }

      // Seed products in batches
      for (const prod of initialData.products || []) {
        if (prod.id && !isFirestoreQuotaExceeded()) {
          await saveDocToFirestore('products', prod.id, prod);
        }
      }

      console.log('[Firestore] Initial seeding complete.');
    }
  } catch (err: any) {
    handleFirestoreError(err, 'Seeding check');
  }
}

/**
 * Save an uploaded image binary (base64) to Firestore for permanent persistence
 */
export async function saveUploadedImageToFirestore(
  fileName: string,
  base64Data: string,
  mimeType: string,
  folder: 'optimized' | 'thumb' | 'original' = 'optimized'
): Promise<void> {
  if (isFirestoreQuotaExceeded() || !fileName || !base64Data) return;
  try {
    // Strip data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    
    // Check size limit: Firestore allows up to 1MB. If larger, we don't crash
    if (cleanBase64.length > 900 * 1024) {
      return;
    }

    const docId = `${folder}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const docRef = doc(firestoreDb, 'uploaded_images', docId);
    await setDoc(docRef, {
      id: docId,
      fileName,
      folder,
      mimeType: mimeType || 'image/webp',
      base64: cleanBase64,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, `Error saving image ${fileName}`);
  }
}

/**
 * Get an individual image from Firestore by folder and fileName
 */
export async function getUploadedImageFromFirestore(
  fileName: string,
  folder: 'optimized' | 'thumb' | 'original' = 'optimized'
): Promise<{ base64: string; mimeType: string } | null> {
  if (isFirestoreQuotaExceeded() || !fileName) return null;
  try {
    const docId = `${folder}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const snap = await getDoc(doc(firestoreDb, 'uploaded_images', docId));
    if (snap.exists()) {
      const data = snap.data();
      return {
        base64: data.base64,
        mimeType: data.mimeType || 'image/webp',
      };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, `Error fetching image ${fileName}`);
    return null;
  }
}

/**
 * Restore all uploaded images from Firestore to the public/uploads directory
 */
export async function restoreUploadedImagesFromFirestore(): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  try {
    const snap = await getDocs(collection(firestoreDb, 'uploaded_images'));
    if (snap.empty) return;

    const { writeFile, mkdir } = await import('fs/promises');
    const { existsSync } = await import('fs');
    const path = await import('path');

    const uploadBase = path.join(process.cwd(), 'public', 'uploads');

    let restoredCount = 0;
    for (const docSnap of snap.docs) {
      const img = docSnap.data();
      if (!img.fileName || !img.base64) continue;

      const folder = img.folder || 'optimized';
      const targetDir = path.join(uploadBase, folder);
      const targetFile = path.join(targetDir, img.fileName);

      if (!existsSync(targetFile)) {
        await mkdir(targetDir, { recursive: true });
        const buffer = Buffer.from(img.base64, 'base64');
        await writeFile(targetFile, buffer);
        restoredCount++;
      }
    }

    if (restoredCount > 0) {
      console.log(`[Firestore Image] Restored ${restoredCount} uploaded images to /public/uploads/`);
    }
  } catch (err) {
    handleFirestoreError(err, 'Restoring images to disk');
  }
}
