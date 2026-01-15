# Solo Leveling Progress Tracker - Technical Plan

> **Document Version:** 1.0  
> **Last Updated:** January 15, 2026  
> **Status:** Active

---

## 📋 Overview

This document outlines the technical strategy for ensuring a secure, highly available, and SEO-optimized Solo Leveling Progress Tracker platform. Our goals are:

1. **Security:** Protect user data and prevent attacks
2. **Uptime:** Achieve 99%+ uptime with proactive monitoring
3. **SEO:** Maximize discoverability and organic growth

---

## 🔐 1. Security Improvements

### 1.1 Authentication & Authorization

| Area | Current | Target | Priority |
|------|---------|--------|----------|
| Password hashing | bcrypt | Argon2id | High |
| Session management | JWT | JWT + refresh tokens, HttpOnly cookies | High |
| OAuth providers | Google | Google, GitHub, Discord | Medium |
| Rate limiting | Basic | Per-route, IP-based, user-based | High |
| RBAC | Admin/User | Admin/Moderator/User with granular permissions | Medium |

### 1.2 Data Protection

| Measure | Description | Priority |
|---------|-------------|----------|
| Encryption at rest | MongoDB field-level encryption for sensitive data | High |
| Encryption in transit | TLS 1.3 for all connections | High |
| Input validation | Zod/Yup schemas on all API routes | High |
| Output encoding | Sanitize all user-generated content | High |
| CORS policy | Strict origin whitelist | High |
| CSP headers | Content Security Policy to prevent XSS | High |

### 1.3 API Security

| Measure | Description | Priority |
|---------|-------------|----------|
| Rate limiting | 100 req/min per user, 20 req/min for auth routes | High |
| Request size limits | Max 10MB for uploads, 1MB for API payloads | High |
| SQL/NoSQL injection | Parameterized queries, Mongoose sanitization | High |
| CSRF protection | CSRF tokens for state-changing requests | High |
| API versioning | /api/v1/ prefix for future-proofing | Medium |

### 1.4 Infrastructure Security

| Measure | Description | Priority |
|---------|-------------|----------|
| Firewall | UFW/iptables, only expose 80/443 | High |
| SSH hardening | Key-only auth, fail2ban | High |
| Secrets management | Environment variables, never in code | High |
| Dependency audit | npm audit, Snyk, Dependabot | High |
| Docker security | Non-root user, minimal base images | Medium |

### 1.5 Security Monitoring

| Tool | Purpose | Priority |
|------|---------|----------|
| Sentry | Error tracking and alerting | High |
| Log aggregation | Centralized logs (Loki, ELK, or Datadog) | Medium |
| Intrusion detection | Fail2ban, WAF (Cloudflare) | High |
| Audit logs | Track sensitive actions (login, data export, admin) | High |

### 1.6 Security Checklist

- [ ] Implement Argon2id for password hashing
- [ ] Add refresh token rotation
- [ ] Set up rate limiting middleware
- [ ] Add CSP, X-Frame-Options, X-Content-Type-Options headers
- [ ] Enable MongoDB field-level encryption
- [ ] Run npm audit and fix vulnerabilities
- [ ] Set up Sentry for error tracking
- [ ] Enable Cloudflare WAF
- [ ] Add audit logging for sensitive actions

---

## 🤖 2. Uptime Bot & Monitoring

### 2.1 Uptime Monitoring Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Uptime Monitoring                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │
│   │  Uptime Bot │───▶│  Endpoints  │───▶│  Alerts   │  │
│   │  (Node.js)  │    │  /health    │    │  Discord  │  │
│   │             │    │  /api/ping  │    │  Email    │  │
│   └─────────────┘    │  /db-check  │    │  SMS      │  │
│         │            └─────────────┘    └───────────┘  │
│         │                                               │
│         ▼                                               │
│   ┌─────────────┐    ┌─────────────┐                   │
│   │  Metrics    │───▶│  Dashboard  │                   │
│   │  Response   │    │  Grafana    │                   │
│   │  Time, 5xx  │    │  or Custom  │                   │
│   └─────────────┘    └─────────────┘                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Uptime Bot Implementation

**File: `scripts/uptime-bot.ts`**

```typescript
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

interface CheckResult {
  endpoint: string;
  status: 'up' | 'down';
  responseTime: number;
  statusCode: number;
  timestamp: Date;
}

interface UptimeConfig {
  endpoints: string[];
  checkInterval: number; // ms
  alertThreshold: number; // consecutive failures
  alertChannels: ('email' | 'discord' | 'slack')[];
}

const config: UptimeConfig = {
  endpoints: [
    'https://yoursite.com/api/health',
    'https://yoursite.com/api/ping',
    'https://yoursite.com/',
  ],
  checkInterval: 60000, // 1 minute
  alertThreshold: 3,
  alertChannels: ['discord', 'email'],
};

const failureCounts: Record<string, number> = {};
const uptimeHistory: CheckResult[] = [];

async function checkEndpoint(url: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const response = await fetch(url, { timeout: 10000 });
    return {
      endpoint: url,
      status: response.ok ? 'up' : 'down',
      responseTime: Date.now() - start,
      statusCode: response.status,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      endpoint: url,
      status: 'down',
      responseTime: Date.now() - start,
      statusCode: 0,
      timestamp: new Date(),
    };
  }
}

async function sendDiscordAlert(message: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🚨 **Uptime Alert**\n${message}`,
      username: 'Uptime Bot',
    }),
  });
}

async function sendEmailAlert(message: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.ALERT_FROM_EMAIL,
    to: process.env.ALERT_TO_EMAIL,
    subject: '🚨 Solo Leveling Uptime Alert',
    text: message,
  });
}

async function alert(result: CheckResult) {
  const message = `
Endpoint: ${result.endpoint}
Status: ${result.status.toUpperCase()}
Status Code: ${result.statusCode}
Response Time: ${result.responseTime}ms
Time: ${result.timestamp.toISOString()}
  `.trim();

  if (config.alertChannels.includes('discord')) {
    await sendDiscordAlert(message);
  }
  if (config.alertChannels.includes('email')) {
    await sendEmailAlert(message);
  }
}

async function runChecks() {
  for (const endpoint of config.endpoints) {
    const result = await checkEndpoint(endpoint);
    uptimeHistory.push(result);

    if (result.status === 'down') {
      failureCounts[endpoint] = (failureCounts[endpoint] || 0) + 1;
      if (failureCounts[endpoint] >= config.alertThreshold) {
        await alert(result);
        failureCounts[endpoint] = 0; // Reset after alert
      }
    } else {
      failureCounts[endpoint] = 0;
    }

    console.log(`[${result.timestamp.toISOString()}] ${endpoint}: ${result.status} (${result.responseTime}ms)`);
  }
}

// Calculate uptime percentage
function calculateUptime(hours: number = 24): number {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const relevant = uptimeHistory.filter(r => r.timestamp >= since);
  if (relevant.length === 0) return 100;
  const upCount = relevant.filter(r => r.status === 'up').length;
  return (upCount / relevant.length) * 100;
}

// Start monitoring
console.log('🚀 Uptime Bot started');
setInterval(runChecks, config.checkInterval);
runChecks(); // Initial check
```

### 2.3 Health Check Endpoints

**File: `src/app/api/health/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'unknown',
  };

  try {
    await connectDB();
    checks.database = 'connected';
  } catch (error) {
    checks.database = 'disconnected';
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
```

### 2.4 Monitoring Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Custom Uptime Bot | Internal monitoring, full control | Free |
| UptimeRobot | External monitoring, 5-min checks | Free tier |
| Better Uptime | Status pages, incident management | $20/mo |
| Grafana Cloud | Metrics visualization | Free tier |
| Prometheus | Metrics collection | Free |

### 2.5 Uptime Checklist

- [ ] Implement `/api/health` endpoint
- [ ] Deploy uptime bot as separate service (Docker/PM2)
- [ ] Set up Discord webhook for alerts
- [ ] Configure email alerts
- [ ] Set up external monitoring (UptimeRobot)
- [ ] Create public status page
- [ ] Set up Grafana dashboard for metrics
- [ ] Document incident response procedures

---

## 🎯 3. 99% Uptime Strategy

### 3.1 High Availability Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CDN (Cloudflare)                    │
│                   DDoS Protection, Cache                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│                   (Nginx / Traefik)                     │
└─────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  App #1  │  │  App #2  │  │  App #3  │
        │ (Next.js)│  │ (Next.js)│  │ (Next.js)│
        └──────────┘  └──────────┘  └──────────┘
              │             │             │
              └─────────────┼─────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Replica Set (3 nodes)              │
│            Primary ──▶ Secondary ──▶ Secondary          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Redis Cluster                        │
│               (Sessions, Caching, Queues)               │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Uptime Requirements

| Uptime % | Downtime/Month | Downtime/Year |
|----------|----------------|---------------|
| 99.0% | 7h 18m | 3.65 days |
| 99.5% | 3h 39m | 1.83 days |
| 99.9% | 43m 50s | 8.76 hours |
| 99.99% | 4m 23s | 52.6 minutes |

**Target: 99.5% (3h 39m downtime/month max)**

### 3.3 Redundancy & Failover

| Component | Strategy | Recovery Time |
|-----------|----------|---------------|
| Application | 3+ replicas with health checks | < 30 seconds |
| Database | MongoDB replica set (3 nodes) | < 10 seconds |
| Cache | Redis Sentinel or Cluster | < 10 seconds |
| CDN | Cloudflare (always-on) | Instant |
| DNS | Multiple providers (Cloudflare + Route53) | < 5 minutes |

### 3.4 Deployment Strategy

| Strategy | Description | Downtime |
|----------|-------------|----------|
| Blue-Green | Two identical environments, instant switch | Zero |
| Rolling | Gradual replacement of instances | Zero |
| Canary | Small % of traffic to new version first | Zero |

**Recommended: Rolling deployment with health checks**

### 3.5 Backup & Recovery

| Data | Backup Frequency | Retention | Recovery Time |
|------|------------------|-----------|---------------|
| MongoDB | Every 6 hours | 30 days | < 1 hour |
| User uploads | Daily to S3/R2 | 90 days | < 2 hours |
| Config/Secrets | On change | Versioned | < 15 minutes |

### 3.6 Uptime Checklist

- [ ] Set up Cloudflare CDN and DDoS protection
- [ ] Configure MongoDB replica set (3 nodes)
- [ ] Implement Redis for session/cache
- [ ] Set up load balancer with health checks
- [ ] Configure rolling deployments
- [ ] Automate backups (6-hour schedule)
- [ ] Test disaster recovery procedures
- [ ] Document runbooks for common incidents

---

## 🔍 4. SEO Strategy

### 4.1 Technical SEO

| Area | Implementation | Priority |
|------|----------------|----------|
| Meta tags | Dynamic titles, descriptions per page | High |
| Open Graph | OG tags for social sharing | High |
| Structured data | JSON-LD for profiles, achievements | Medium |
| Sitemap | Auto-generated sitemap.xml | High |
| Robots.txt | Proper crawl directives | High |
| Canonical URLs | Prevent duplicate content | High |
| Mobile-first | Responsive design, Core Web Vitals | High |

### 4.2 Next.js SEO Implementation

**File: `src/app/layout.tsx` (Metadata)**

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://yoursite.com'),
  title: {
    default: 'Solo Leveling Progress Tracker | Level Up Your Life',
    template: '%s | Solo Leveling Tracker',
  },
  description: 'Gamify your self-improvement journey. Track habits, earn XP, compete with friends and rivals, and level up your real life—Solo Leveling style.',
  keywords: ['habit tracker', 'gamification', 'self-improvement', 'Solo Leveling', 'level up', 'XP', 'productivity'],
  authors: [{ name: 'Solo Leveling Tracker Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    siteName: 'Solo Leveling Progress Tracker',
    title: 'Solo Leveling Progress Tracker | Level Up Your Life',
    description: 'Gamify your self-improvement journey. Track habits, earn XP, compete with friends and rivals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Solo Leveling Progress Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solo Leveling Progress Tracker',
    description: 'Gamify your self-improvement journey.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

### 4.3 Sitemap Generation

**File: `src/app/sitemap.ts`**

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yoursite.com';

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/posts`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/auth/signin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/auth/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Add dynamic pages (public profiles, etc.) here
  // const users = await getPublicProfiles();
  // const userPages = users.map(user => ({
  //   url: `${baseUrl}/profile/${user.username}`,
  //   lastModified: user.updatedAt,
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }));

  return [...staticPages];
}
```

### 4.4 Robots.txt

**File: `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /settings/

Sitemap: https://yoursite.com/sitemap.xml
```

### 4.5 Core Web Vitals Optimization

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | Image optimization, lazy loading, CDN |
| FID (First Input Delay) | < 100ms | Code splitting, defer non-critical JS |
| CLS (Cumulative Layout Shift) | < 0.1 | Reserve space for images, fonts |
| TTFB (Time to First Byte) | < 200ms | Edge caching, optimized server |

### 4.6 Content SEO

| Strategy | Description |
|----------|-------------|
| Landing pages | SEO-optimized pages for key terms |
| Blog | Tips, guides, success stories |
| Public profiles | Shareable achievement pages |
| Leaderboards | Indexable, dynamic content |
| FAQs | Structured data for search snippets |

### 4.7 SEO Checklist

- [ ] Add dynamic meta tags to all pages
- [ ] Implement Open Graph and Twitter cards
- [ ] Generate sitemap.xml automatically
- [ ] Create robots.txt with proper directives
- [ ] Add JSON-LD structured data for profiles
- [ ] Optimize images (WebP, lazy loading)
- [ ] Achieve Core Web Vitals targets
- [ ] Set up Google Search Console
- [ ] Submit sitemap to search engines
- [ ] Create SEO-friendly landing pages

---

## 📅 Implementation Timeline

| Phase | Focus | Duration | Target Date |
|-------|-------|----------|-------------|
| Phase 1 | Security hardening | 2 weeks | Jan 31, 2026 |
| Phase 2 | Uptime bot & monitoring | 1 week | Feb 7, 2026 |
| Phase 3 | High availability setup | 2 weeks | Feb 21, 2026 |
| Phase 4 | SEO implementation | 2 weeks | Mar 7, 2026 |
| Phase 5 | Testing & optimization | 1 week | Mar 14, 2026 |

---

## 📝 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-15 | Technical Team | Initial technical plan |

---

## 🔗 Related Documents

- [PRODUCT_PLAN.md](./PRODUCT_PLAN.md) - Product vision and roadmap
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [SETUP.md](../SETUP.md) - Development setup guide

---

*"The system sees all. The system is always watching."*
