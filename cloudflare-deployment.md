# Cloudflare Pages Deployment Guide

This document provides step-by-step instructions for deploying the 10 Minute Timer application to Cloudflare Pages.

## Why Cloudflare Pages?

✅ **Perfect Match for This Project:**
- **Static Site**: React/Vite build generates static files
- **Global CDN**: Fast loading worldwide
- **Free Tier**: Generous limits for personal projects
- **Custom Domains**: Support for `10-minute-timer.website`
- **HTTPS**: Automatic SSL certificates
- **Analytics**: Built-in web analytics
- **Edge Functions**: Optional server-side functionality

## Deployment Configuration

### Build Settings

```yaml
Build Command: npm run build
Build Output Directory: dist
Root Directory: (leave empty)
Node.js Version: 18.x or 20.x
```

### Environment Variables

```bash
# Optional: Analytics Configuration
VITE_GA_TRACKING_ID=G-95QM6WDW2G
VITE_CLARITY_PROJECT_ID=ta5905uow4

# Optional: Build Optimization
NODE_ENV=production
VITE_BUILD_TARGET=es2020
```

## Step-by-Step Deployment

### Method 1: GitHub Integration (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages" in the sidebar

2. **Connect GitHub Repository**
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose GitHub and authorize Cloudflare
   - Select repository: `Candseven88/10-minute-timer`

3. **Configure Build Settings**
   ```
   Project name: 10-minute-timer
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave empty)
   ```

4. **Set Environment Variables** (Optional)
   ```
   NODE_ENV = production
   VITE_GA_TRACKING_ID = G-95QM6WDW2G
   VITE_CLARITY_PROJECT_ID = ta5905uow4
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - First build will take 2-5 minutes
   - You'll get a URL like: `https://10-minute-timer.pages.dev`

### Method 2: Direct Upload

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Upload to Cloudflare**
   - Go to Cloudflare Pages
   - Click "Upload assets"
   - Drag and drop the `dist` folder
   - Set project name: `10-minute-timer`

## Custom Domain Setup

### Add Your Domain

1. **In Cloudflare Pages Project**
   - Go to "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter: `10-minute-timer.website`

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: @
   Content: 10-minute-timer.pages.dev
   Proxy Status: Proxied (orange cloud)
   
   Type: CNAME
   Name: www
   Content: 10-minute-timer.pages.dev
   Proxy Status: Proxied (orange cloud)
   ```

### SSL/TLS Settings

```
SSL/TLS encryption mode: Full (strict)
Always Use HTTPS: On
Automatic HTTPS Rewrites: On
```

## Performance Optimization

### Headers Configuration

Create `public/_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.ico
  Cache-Control: public, max-age=31536000, immutable
```

### Redirects Configuration

Create `public/_redirects` file:

```
# Redirect www to non-www
https://www.10-minute-timer.website/* https://10-minute-timer.website/:splat 301!

# SPA fallback
/* /index.html 200
```

## Analytics Integration

### Cloudflare Web Analytics

1. **Enable in Dashboard**
   - Go to your domain in Cloudflare
   - Navigate to "Analytics" > "Web Analytics"
   - Click "Enable Web Analytics"

2. **Add to HTML** (Optional - already have GA)
   ```html
   <!-- Already integrated Google Analytics and Clarity -->
   <!-- Cloudflare Analytics works automatically -->
   ```

### Google Analytics 4

✅ **Already Configured**
- Tracking ID: `G-95QM6WDW2G`
- Automatically tracks page views
- Custom events for timer interactions

### Microsoft Clarity

✅ **Already Configured**
- Project ID: `ta5905uow4`
- Session recordings enabled
- Heatmaps and user behavior tracking

## SEO Configuration

### Robots.txt

✅ **Already Created**: `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://10-minute-timer.website/sitemap.xml
```

### Sitemap

✅ **Already Created**: `public/sitemap.xml`
- Contains all timer variations
- Proper priority and frequency settings
- Submit to Google Search Console

### Meta Tags

✅ **Already Configured** in `index.html`:
- Complete SEO meta tags
- Open Graph for social sharing
- Twitter Cards
- Structured data (Schema.org)

## Monitoring & Maintenance

### Performance Monitoring

```bash
# Lighthouse CI (optional)
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

### Uptime Monitoring

- Use Cloudflare's built-in monitoring
- Set up alerts for downtime
- Monitor Core Web Vitals

### Analytics Tracking

1. **Google Analytics 4**
   - Monitor user engagement
   - Track timer usage patterns
   - Set up conversion goals

2. **Microsoft Clarity**
   - Review user session recordings
   - Analyze heatmaps
   - Identify UX improvements

3. **Cloudflare Analytics**
   - Monitor traffic patterns
   - Check performance metrics
   - Track geographic distribution

## Deployment Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured correctly
- [ ] Environment variables set (if needed)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS records properly set
- [ ] _headers file for security
- [ ] _redirects file for SPA routing
- [ ] Analytics tracking verified
- [ ] Sitemap submitted to Google Search Console
- [ ] Performance optimized (Lighthouse score 90+)

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version
   Node.js version: 18.x or 20.x
   
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Route Issues (404 on refresh)**
   - Ensure `_redirects` file exists in `public/`
   - Add SPA fallback: `/* /index.html 200`

3. **Analytics Not Working**
   - Verify tracking IDs in environment variables
   - Check browser console for errors
   - Confirm GDPR compliance if applicable

### Support Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router SPA Deployment](https://reactrouter.com/en/main/guides/ssr)

## Cost Estimation

### Cloudflare Pages (Free Tier)
- ✅ **Bandwidth**: 100GB/month
- ✅ **Builds**: 500 builds/month
- ✅ **Requests**: 100,000/day
- ✅ **Custom Domain**: Included
- ✅ **SSL**: Free

### Expected Usage
- **Static Assets**: ~2MB per page load
- **Monthly Traffic**: Easily supports 10k+ visitors
- **Build Frequency**: 1-2 builds per day
- **Cost**: $0/month (within free tier)

Perfect for this timer application! 🚀 