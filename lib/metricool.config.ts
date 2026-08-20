/**
 * METRICOOL WEBSITE ANALYTICS CONFIGURATION
 * 
 * -----------------------------------------------------------------------------
 * HOW TO CONFIGURE METRICOOL TRACKING:
 * -----------------------------------------------------------------------------
 * 1. Go to your Metricool Dashboard (https://app.metricool.com)
 * 2. Navigate to: Brand Settings -> Web / Blog connection -> JavaScript Tracking Code
 * 3. Copy your unique Tracker Hash (or the provided code snippet).
 * 4. Paste your hash in either:
 *    Option A (Recommended): In your environment file (.env.local):
 *       NEXT_PUBLIC_METRICOOL_TRACKER_HASH=your_metricool_hash_here
 *    Option B: Directly replace the value of `manualTrackerHash` below:
 *       manualTrackerHash: 'your_metricool_hash_here'
 * 
 * NOTE: Do NOT invent or hardcode a placeholder hash. Leave it empty until
 * you have obtained your real tracking code from Metricool.
 * -----------------------------------------------------------------------------
 */

export interface MetricoolConfig {
  /**
   * Your unique Metricool tracker hash provided by Metricool.
   * e.g. "a1b2c3d4e5f6g7h8i9j0"
   */
  trackerHash?: string;
  
  /**
   * Whether Metricool tracking is enabled.
   */
  enabled?: boolean;
}

// You can optionally paste your Metricool hash directly here if not using environment variables:
const manualTrackerHash = 'd11728bdad00d0c3949f8eefd8fa8f60';

/**
 * Extracts and cleans the Metricool tracker hash from an environment variable,
 * raw string, or snippet.
 */
export function getMetricoolTrackerHash(): string {
  const rawValue = (process.env.NEXT_PUBLIC_METRICOOL_TRACKER_HASH || manualTrackerHash || '').trim();

  if (!rawValue) {
    return '';
  }

  // If the user pasted the entire script or object: extract the hash value
  const hashMatch = rawValue.match(/hash\s*:\s*["']([a-zA-Z0-9_-]+)["']/i);
  if (hashMatch && hashMatch[1]) {
    return hashMatch[1].trim();
  }

  // Otherwise return the raw sanitized string (alphanumeric, hyphens, underscores)
  return rawValue.replace(/[^a-zA-Z0-9_-]/g, '').trim();
}

export const METRICOOL_CONFIG: MetricoolConfig = {
  get trackerHash() {
    return getMetricoolTrackerHash();
  },
  enabled: true,
};
