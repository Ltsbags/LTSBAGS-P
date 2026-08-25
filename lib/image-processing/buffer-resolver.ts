import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface ResolvedImageBuffer {
  buffer: Buffer;
  sourceType: 'data-url' | 'local-file' | 'remote-url' | 'raw-base64' | 'binary-file';
  mimeType?: string;
  originalPath?: string;
}

/**
 * Safely resolves an image buffer from any source:
 * - Data URLs (data:image/...)
 * - Local filesystem paths (/uploads/..., /images/..., public/...)
 * - HTTP/HTTPS remote URLs (Unsplash, CDN, etc.)
 * - Raw Base64 strings
 * - ArrayBuffers or File objects
 */
export async function resolveImageBuffer(
  input: string | Buffer | ArrayBuffer | Uint8Array | null | undefined
): Promise<ResolvedImageBuffer> {
  if (!input) {
    throw new Error('No image data provided');
  }

  // 1. If input is already a Buffer
  if (Buffer.isBuffer(input)) {
    if (input.length === 0) throw new Error('Received empty image buffer');
    await validateSharpBuffer(input);
    return { buffer: input, sourceType: 'binary-file' };
  }

  // 2. If input is an ArrayBuffer or Uint8Array
  if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
    const buf = Buffer.from(input as any);
    if (buf.length === 0) throw new Error('Received empty image buffer');
    await validateSharpBuffer(buf);
    return { buffer: buf, sourceType: 'binary-file' };
  }

  if (typeof input !== 'string') {
    throw new Error('Invalid image input type: expected string URL or buffer');
  }

  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Empty image URL or path provided');
  }

  // 3. Data URLs: data:image/png;base64,...
  if (trimmed.startsWith('data:')) {
    const commaIdx = trimmed.indexOf(',');
    if (commaIdx === -1) {
      throw new Error('Malformed data URL: missing comma separator');
    }
    const header = trimmed.slice(0, commaIdx);
    const base64Data = trimmed.slice(commaIdx + 1).replace(/\s/g, '');
    
    // Extract mime type if available
    const mimeMatch = header.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : undefined;

    try {
      const buf = Buffer.from(base64Data, 'base64');
      if (buf.length === 0) throw new Error('Data URL contains empty image data');
      await validateSharpBuffer(buf);
      return { buffer: buf, sourceType: 'data-url', mimeType, originalPath: header };
    } catch (err: any) {
      throw new Error(`Invalid data URL image data: ${err.message || 'Could not parse base64'}`);
    }
  }

  // 4. Remote URLs: http:// or https://
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(trimmed, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch image (HTTP ${res.status}: ${res.statusText})`);
      }

      const arrayBuf = await res.arrayBuffer();
      const buf = Buffer.from(arrayBuf);

      if (buf.length === 0) {
        throw new Error('Remote image response is empty');
      }

      await validateSharpBuffer(buf);
      return {
        buffer: buf,
        sourceType: 'remote-url',
        mimeType: res.headers.get('content-type') || undefined,
        originalPath: trimmed,
      };
    } catch (fetchErr: any) {
      if (fetchErr.name === 'AbortError') {
        throw new Error('Timed out fetching remote image from URL');
      }
      throw new Error(`Could not fetch remote image: ${fetchErr.message || 'Network error'}`);
    }
  }

  // 5. Local file paths: /uploads/..., /images/..., public/...
  // Normalize path
  let relativePath = trimmed;
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.slice(1);
  }

  const possibleFilePaths = [
    path.join(process.cwd(), 'public', relativePath),
    path.join(process.cwd(), relativePath),
    path.join(process.cwd(), 'public', 'uploads', relativePath.replace(/^uploads\//, '')),
  ];

  for (const filePath of possibleFilePaths) {
    if (existsSync(filePath)) {
      try {
        const buf = await readFile(filePath);
        if (buf.length > 0) {
          await validateSharpBuffer(buf);
          return {
            buffer: buf,
            sourceType: 'local-file',
            originalPath: trimmed,
          };
        }
      } catch (readErr: any) {
        console.warn(`Failed reading file at ${filePath}:`, readErr);
      }
    }
  }

  // 6. Check if it's a raw base64 string (no data: prefix)
  // Only attempt if it looks like base64 (> 100 chars, no slashes of file paths)
  if (trimmed.length > 100 && /^[A-Za-z0-9+/=\s]+$/.test(trimmed)) {
    try {
      const cleanBase64 = trimmed.replace(/\s/g, '');
      const buf = Buffer.from(cleanBase64, 'base64');
      if (buf.length > 10) {
        await validateSharpBuffer(buf);
        return { buffer: buf, sourceType: 'raw-base64' };
      }
    } catch {
      // not base64, proceed to error
    }
  }

  // If local file was expected but doesn't exist on disk (e.g. server restarted or container reset)
  throw new Error(
    `Image source '${trimmed.length > 60 ? trimmed.slice(0, 60) + '...' : trimmed}' could not be located. If this was an earlier upload, please upload the image file again.`
  );
}

/**
 * Validates that Sharp can read the image buffer and provides a clean error if not
 */
async function validateSharpBuffer(buffer: Buffer): Promise<void> {
  if (!buffer || buffer.length === 0) {
    throw new Error('Image buffer is empty');
  }

  try {
    const meta = await sharp(buffer).metadata();
    if (!meta || !meta.format) {
      throw new Error('Image format could not be identified');
    }
  } catch (err: any) {
    throw new Error(`Input contains unsupported or corrupt image format (${err.message || 'Sharp parse error'})`);
  }
}
