/**
 * Next.js Configuration
 *
 * Configured for static export to enable deployment on platforms like
 * Vercel, Netlify, GitHub Pages, and other static hosting services.
 *
 * Key configurations:
 * - Static export: Generates static HTML/CSS/JS files
 * - Image optimization disabled: Required for static export
 * - ESLint ignored during builds: Prevents build failures from linting errors
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment to static hosting platforms
  output: 'export',

  // Disable ESLint during builds to prevent deployment failures
  // Note: Still run ESLint locally during development
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable image optimization for static export compatibility
  // The Next.js Image component requires a server for optimization
  images: {
    unoptimized: true
  },

  // Optional: Configure trailing slash behavior
  // trailingSlash: true,

  // Optional: Configure asset prefix for CDN deployment
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
};

module.exports = nextConfig;
