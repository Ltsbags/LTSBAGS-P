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

let isSyncingFromFirestore = false;
let isInitialized = false;

/**
 * Save an individual document to Firestore
 */
export async function saveDocToFirestore(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    if (!docId) return;
    const sanitized = sanitizeForFirestore(data);
    const docRef = doc(firestoreDb, collectionName, String(docId));
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    console.error(`[Firestore] Error saving to ${collectionName}/${docId}:`, err);
  }
}

/**
 * Delete an individual document from Firestore
 */
export async function deleteDocFromFirestore(collectionName: string, docId: string): Promise<void> {
  try {
    if (!docId) return;
    const docRef = doc(firestoreDb, collectionName, String(docId));
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`[Firestore] Error deleting ${collectionName}/${docId}:`, err);
  }
}

/**
 * Load all data from Firestore into a DatabaseSchema object
 */
export async function loadAllDataFromFirestore(): Promise<Partial<DatabaseSchema> | null> {
  if (isSyncingFromFirestore) return null;
  isSyncingFromFirestore = true;

  try {
    const result: Partial<DatabaseSchema> = {};

    // 1. Settings
    try {
      const settingsDoc = await getDoc(doc(firestoreDb, 'settings', 'global'));
      if (settingsDoc.exists()) {
        result.settings = settingsDoc.data() as SiteSettings;
      }
    } catch (e) {
      console.warn('[Firestore] Could not load settings:', e);
    }

    // 2. Navigation
    try {
      const navDoc = await getDoc(doc(firestoreDb, 'navigation', 'main'));
      if (navDoc.exists()) {
        result.navigation = navDoc.data() as NavigationMenuConfig;
      }
    } catch (e) {
      console.warn('[Firestore] Could not load navigation:', e);
    }

    // 3. Languages
    try {
      const langDoc = await getDoc(doc(firestoreDb, 'settings', 'languages'));
      if (langDoc.exists()) {
        result.languageSettings = langDoc.data() as LanguageSettings;
      }
    } catch (e) {
      console.warn('[Firestore] Could not load languages:', e);
    }

    // 4. Collections
    const fetchCollection = async <T>(collName: string): Promise<T[]> => {
      try {
        const snap = await getDocs(collection(firestoreDb, collName));
        const items: T[] = [];
        snap.forEach((d) => {
          items.push({ ...d.data(), id: d.id } as T);
        });
        return items;
      } catch (err) {
        console.warn(`[Firestore] Error loading collection ${collName}:`, err);
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

    // Restore any uploaded images from Firestore to disk in the background
    restoreUploadedImagesFromFirestore().catch((err) => {
      console.warn('[Firestore] Async image restoration error:', err);
    });

    return result;
  } catch (err) {
    console.error('[Firestore] Failed to load full data from Firestore:', err);
    return null;
  } finally {
    isSyncingFromFirestore = false;
  }
}

/**
 * Seed initial data to Firestore if Firestore is empty
 */
export async function seedInitialDataToFirestore(initialData: DatabaseSchema): Promise<void> {
  if (isInitialized) return;
  isInitialized = true;

  try {
    const settingsDoc = await getDoc(doc(firestoreDb, 'settings', 'global'));
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
        if (cat.id) {
          await saveDocToFirestore('categories', cat.id, cat);
        }
      }

      // Seed products in batches
      for (const prod of initialData.products || []) {
        if (prod.id) {
          await saveDocToFirestore('products', prod.id, prod);
        }
      }

      // Seed blogs
      for (const b of initialData.blogs || []) {
        if (b.id) {
          await saveDocToFirestore('blogs', b.id, b);
        }
      }

      // Seed slides
      for (const s of initialData.slides || []) {
        if (s.id) {
          await saveDocToFirestore('slides', s.id, s);
        }
      }

      // Seed clients
      for (const cl of initialData.clients || []) {
        if (cl.id) {
          await saveDocToFirestore('clients', cl.id, cl);
        }
      }

      // Seed FAQs
      for (const f of initialData.faqs || []) {
        if (f.id) {
          await saveDocToFirestore('faqs', f.id, f);
        }
      }

      // Seed Testimonials
      for (const t of initialData.testimonials || []) {
        if (t.id) {
          await saveDocToFirestore('testimonials', t.id, t);
        }
      }

      console.log('[Firestore] Initial seeding complete.');
    }
  } catch (err) {
    console.error('[Firestore] Error during seeding:', err);
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
  try {
    if (!fileName || !base64Data) return;
    // Strip data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    
    // Check size limit: Firestore allows up to 1MB. If larger, we don't crash
    if (cleanBase64.length > 900 * 1024) {
      console.warn(`[Firestore Image] ${fileName} exceeds 900KB base64 limit, skipping firestore image backup`);
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
    console.log(`[Firestore Image] Persisted image ${docId} to Firestore`);
  } catch (err) {
    console.error(`[Firestore Image] Error saving image ${fileName} to Firestore:`, err);
  }
}

/**
 * Get an individual image from Firestore by folder and fileName
 */
export async function getUploadedImageFromFirestore(
  fileName: string,
  folder: 'optimized' | 'thumb' | 'original' = 'optimized'
): Promise<{ base64: string; mimeType: string } | null> {
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
    console.error(`[Firestore Image] Error fetching image ${fileName}:`, err);
    return null;
  }
}

/**
 * Restore all uploaded images from Firestore to the public/uploads directory
 */
export async function restoreUploadedImagesFromFirestore(): Promise<void> {
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
    console.error('[Firestore Image] Error restoring images to disk:', err);
  }
}
