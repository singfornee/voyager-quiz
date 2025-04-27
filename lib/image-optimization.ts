// Helper functions for image optimization

/**
 * Preloads an image to improve perceived performance
 * @param src The image source URL to preload
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
  })
}

/**
 * Preloads multiple images in parallel
 * @param sources Array of image source URLs to preload
 */
export function preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(sources.map(preloadImage))
}

/**
 * Generates a responsive image srcSet for different viewport sizes
 * @param basePath The base path of the image
 * @param widths Array of widths to generate srcSet for
 * @param extension File extension (default: 'png')
 */
export function generateSrcSet(basePath: string, widths: number[], extension = "png"): string {
  return widths.map((width) => `${basePath}-${width}w.${extension} ${width}w`).join(", ")
}

/**
 * Calculates the optimal image size based on device pixel ratio and container width
 * @param containerWidth The width of the container in pixels
 * @param pixelRatio The device pixel ratio (default: window.devicePixelRatio or 1)
 */
export function getOptimalImageSize(
  containerWidth: number,
  pixelRatio: number = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
): number {
  return Math.round(containerWidth * pixelRatio)
}

/**
 * Adds a blur-up effect for progressive image loading
 * @param element The image element to apply the effect to
 * @param src The final image source
 * @param placeholderSrc The placeholder image source (low quality)
 */
export function applyBlurUpEffect(element: HTMLImageElement, src: string, placeholderSrc: string): void {
  // Set initial placeholder
  element.src = placeholderSrc
  element.classList.add("blur-up")

  // Load the full image
  const img = new Image()
  img.src = src
  img.crossOrigin = "anonymous"
  img.onload = () => {
    element.src = src
    element.classList.add("blur-up-finish")
  }
}
