/**
 * Composable for taking screenshots of build cards.
 * Uses html-to-image to render a DOM element to a PNG image.
 */
import { toPng } from 'html-to-image';

/**
 * Capture a screenshot of the given DOM element.
 * Copies to clipboard and optionally downloads.
 * @param {HTMLElement} element - The DOM element to screenshot
 * @param {object} options - { filename, download }
 * @returns {Promise<boolean>} - true if successful
 */
export async function captureScreenshot(element, options = {}) {
  const { filename = 'build-screenshot.png', download = false } = options;

  if (!element) return false;

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#1f2937', // gray-800
      pixelRatio: 2, // Retina quality
      skipFonts: true, // Skip web font embedding to avoid crashes
      filter: (node) => !node?.hasAttribute?.('data-no-screenshot'),
    });

    // Convert data URL to blob without fetch (CSP-safe)
    const blob = dataUrlToBlob(dataUrl);
    if (!blob) return false;

    // Copy to clipboard
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
    } catch {
      // Clipboard API might fail (permissions, non-secure context)
      // Fall back to download
      downloadBlob(blob, filename);
      return true;
    }

    // Optionally also download
    if (download) {
      downloadBlob(blob, filename);
    }

    return true;
  } catch (err) {
    console.error('Screenshot failed:', err);
    return false;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Convert a data URL to a Blob without fetch (CSP-safe) */
function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}
