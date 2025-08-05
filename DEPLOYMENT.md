# Deployment Guide

This guide covers deploying the ADmyBRAND Insights Dashboard to various hosting platforms.

## 🚀 Quick Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

**One-Click Deployment:**
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Your app will be automatically deployed

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/your-repo)

**One-Click Deployment:**
1. Click the "Deploy to Netlify" button above
2. Connect your GitHub account
3. Your app will be automatically deployed

**Manual Deployment:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=out
```

## 📋 Pre-Deployment Checklist

- [ ] All dependencies are listed in `package.json`
- [ ] Build command works locally (`npm run build`)
- [ ] Static export is configured in `next.config.js`
- [ ] No server-side dependencies in client code
- [ ] Environment variables are configured (if any)
- [ ] Performance optimizations are in place

## 🔧 Platform-Specific Configuration

### Vercel Configuration

The project includes a `vercel.json` file with:
- Build settings for static export
- Security headers
- Cache optimization
- SPA routing support

### Netlify Configuration

The project includes a `netlify.toml` file with:
- Build command and publish directory
- Redirect rules for SPA routing
- Security headers
- Cache optimization for static assets

### GitHub Pages

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (requires gh-pages package)
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d out"

npm run deploy
```

### AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Upload to S3 bucket
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🌍 Environment Variables

Currently, this project doesn't require environment variables for basic functionality. If you add external APIs or services, create a `.env.local` file:

```bash
# Example environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

**Important:** Never commit `.env.local` to version control.

## 🔒 Security Considerations

### Content Security Policy

The deployment configurations include basic CSP headers. For production, consider:

```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' data:;
```

### HTTPS

All modern hosting platforms provide HTTPS by default. Ensure:
- SSL certificates are properly configured
- HTTP redirects to HTTPS
- HSTS headers are enabled

## 📊 Performance Optimization

### Build Optimization

The project is configured for optimal performance:
- Static export for fast loading
- Tree shaking for smaller bundles
- Image optimization (when using Next.js Image component)
- CSS optimization with Tailwind CSS

### CDN Configuration

Most platforms provide CDN automatically. For custom setups:
- Cache static assets for 1 year
- Cache HTML files for 1 hour
- Use compression (gzip/brotli)

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run lint`

**Routing Issues:**
- Ensure SPA redirects are configured
- Check that all routes use client-side navigation
- Verify `next.config.js` has `output: 'export'`

**Performance Issues:**
- Enable compression on your hosting platform
- Optimize images and assets
- Check bundle size with `npm run build`

### Getting Help

1. Check the [Next.js deployment documentation](https://nextjs.org/docs/deployment)
2. Review platform-specific guides (Vercel, Netlify, etc.)
3. Check the project's GitHub issues
4. Contact support for your hosting platform

## 📈 Monitoring

After deployment, consider setting up:
- Analytics (Google Analytics, Vercel Analytics)
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Web Vitals)
- Uptime monitoring

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

### Automatic Deployments

Both Vercel and Netlify support automatic deployments:
- Connect your Git repository
- Configure branch settings
- Enable automatic deployments on push

---

For more detailed information, refer to the main [README.md](./README.md) file.
