# Solo Leveling Progress Tracker - Product Plan

> **Document Version:** 1.0  
> **Last Updated:** December 31, 2025  
> **Status:** Active

---

## 🎯 Vision & Value Proposition

### Vision
Gamify personal growth by transforming daily habits into an epic RPG journey, making self-improvement addictive and social.

### Target Audience
- **Self-improvement enthusiasts** (ages 18-35)
- **Habit trackers** who find traditional apps boring
- **Gamers** who want productive dopamine hits
- **Data enthusiasts** who love visualizing their lives
- **Anime/manhwa fans** (Solo Leveling community)

### Core Value Proposition
> "Level up your real life like Sung Jin-Woo"

### Competitive Advantage
| Competitor | Their Focus | Our Differentiation |
|------------|-------------|---------------------|
| Habitica | Generic RPG gamification | Solo Leveling theme, modern UI, social competition |
| Streaks | Simple habit tracking | Deeper gamification, community features |
| Daylio | Mood tracking | Action-focused, competitive elements |
| Strava | Fitness only | All life categories, unified leveling |

---

## 📊 MoSCoW Prioritization

### 🔴 MUST HAVE (MVP - Q1 2026)
*Critical for launch - without these, the product fails*

| ID | Feature | Description | Status | Effort |
|----|---------|-------------|--------|--------|
| M1 | Core Tracking | Daily activity logging with categories & sub-goals | ✅ Done | - |
| M2 | XP & Leveling System | Points system with level progression | ✅ Done | - |
| M3 | Stats Dashboard | View progress, streaks, completion rates | ✅ Done | - |
| M4 | Mobile PWA | Installable app for quick daily access | ✅ Done | - |
| M5 | User Authentication | Secure accounts with data persistence | ✅ Done | - |
| M6 | Streak System | Track consecutive days, streak freezes | 🔲 Planned | Medium |
| M7 | Daily Notifications | Push reminders to log activities | 🔲 Planned | Medium |
| M8 | Data Export | Export your data (JSON/CSV) - trust & ownership | 🔲 Planned | Low |

### 🟠 SHOULD HAVE (Q2 2026)
*High value features that significantly improve the product*

| ID | Feature | Description | Effort |
|----|---------|-------------|--------|
| S1 | 🏆 Global Leaderboards | Weekly/monthly/all-time rankings by XP | High |
| S2 | 👥 Friend System | Add friends, see their progress | High |
| S3 | 🎖️ Achievement Badges | Unlock badges for milestones (100 workouts, etc.) | Medium |
| S4 | 📈 Advanced Analytics | Weekly trends, category breakdowns, insights | Medium |
| S5 | 🎨 Hunter Ranks | E → S rank progression with visual rewards | Low |
| S6 | 🔔 Smart Reminders | Context-aware notifications based on patterns | Medium |
| S7 | 📱 Native Feel | Haptic feedback, smooth animations | Low |

### 🟡 COULD HAVE (Q3-Q4 2026)
*Nice to have - implement if time/resources allow*

| ID | Feature | Description | Effort |
|----|---------|-------------|--------|
| C1 | 🎁 Year Wrapped | Spotify-style annual summary with shareable cards | High |
| C2 | 🏘️ Local Leaderboards | City/country rankings, find nearby hunters | High |
| C3 | ⚔️ Guild System | Create/join teams, group challenges | Very High |
| C4 | 🎯 Challenges | Weekly community challenges with rewards | Medium |
| C5 | 🤖 AI Insights | "You're most productive on Tuesdays" | Medium |
| C6 | 🎮 Boss Raids | Group goals that unlock when combined effort hits target | High |
| C7 | 🛒 Cosmetic Shop | Spend earned coins on profile customization | Medium |
| C8 | 📊 Public Profiles | Shareable achievement pages | Low |
| C9 | 🔗 Integrations | Sync with Strava, Apple Health, Google Fit | Very High |
| C10 | 🌙 Dark Dungeons | Special limited-time events with bonus XP | Medium |

### ⚪ WON'T HAVE (Not in 2026)
*Explicitly out of scope*

| Feature | Reason |
|---------|--------|
| Native iOS/Android apps | PWA sufficient for MVP, revisit in 2027 |
| Monetization/Premium tier | Build user base first |
| Social feed/posts | Avoid becoming another social network |
| Real money rewards | Legal complexity, wrong motivation |
| Wearable apps | Too fragmented, use integrations instead |

---

## 🗓️ Product Roadmap

### Q1 2026: Foundation
```
├── Streak system with freeze tokens
├── Push notifications (PWA)
├── Data export
├── Bug fixes & polish
└── Soft launch (beta users)
```

**Key Deliverables:**
- [ ] Streak tracking with visual indicators
- [ ] 3 free streak freezes per month
- [ ] Web push notification setup
- [ ] JSON/CSV export functionality
- [ ] Beta user onboarding (target: 500 users)

### Q2 2026: Social & Competition
```
├── Global leaderboards (weekly/monthly)
├── Friend system
├── Achievement badges (20+ badges)
├── Hunter rank system (E to S)
└── Marketing push
```

**Key Deliverables:**
- [ ] Leaderboard infrastructure (efficient ranking queries)
- [ ] Friend add/remove/block functionality
- [ ] 20+ achievement badges designed and implemented
- [ ] Hunter rank progression (E, D, C, B, A, S)
- [ ] Launch marketing campaign

### Q3 2026: Insights & Engagement
```
├── Year Wrapped (preview for early users)
├── Advanced analytics dashboard
├── AI-powered insights
├── Weekly challenges
└── Local leaderboards
```

**Key Deliverables:**
- [ ] Year Wrapped card generation system
- [ ] Analytics with charts and trends
- [ ] Basic AI/ML insights engine
- [ ] Weekly challenge system
- [ ] Location-based leaderboards (opt-in)

### Q4 2026: Community & Events
```
├── Full Year Wrapped launch
├── Guild system
├── Boss raids
├── Seasonal events
└── 2027 planning
```

**Key Deliverables:**
- [ ] Year Wrapped public launch with sharing
- [ ] Guild creation and management
- [ ] Collaborative boss raid events
- [ ] Holiday-themed special events
- [ ] 2027 roadmap finalized

---

## 🎁 Feature Deep Dive: Year Wrapped

### Concept
A shareable, animated summary of the user's year (inspired by Spotify Wrapped)

### Statistics to Display
1. **Total XP earned** - "You gained 45,230 XP this year"
2. **Level progress** - "You went from Level 12 to Level 47"
3. **Top category** - "Your #1 focus was 💪 Strength (342 completions)"
4. **Longest streak** - "Your best streak was 67 days"
5. **Most productive day** - "Tuesdays are your power day"
6. **Most productive month** - "October was your peak month"
7. **Rarest achievement** - "Only 3% of hunters earned this"
8. **Hunter rank achieved** - "You reached A-Rank Hunter"
9. **Global comparison** - "You're in the top 15% of all hunters"
10. **Fun facts** - "You completed more activities than 89% of users"

### Shareable Formats
| Format | Dimensions | Use Case |
|--------|------------|----------|
| Instagram Story | 1080x1920 (9:16) | Story sharing |
| Twitter Card | 1200x675 (16:9) | Tweet embeds |
| Square | 1080x1080 (1:1) | General sharing |
| Animated | Video/Lottie | Premium feel |

### Timeline
- **December 1:** Begin generating wrapped data
- **December 15-31:** Push notifications to view wrapped
- **January 1-7:** Extended sharing period

### Technical Requirements
- Pre-computed statistics (daily aggregation jobs)
- Image generation service (Canvas API or server-side)
- Social sharing meta tags
- Deep linking for shared wraps

---

## 🏆 Feature Deep Dive: Leaderboards

### Global Leaderboards

| Board | Reset Frequency | Metric | Purpose |
|-------|-----------------|--------|---------|
| Weekly Warriors | Every Monday 00:00 UTC | XP earned this week | Encourage weekly consistency |
| Monthly Masters | 1st of month | XP earned this month | Longer-term engagement |
| All-Time Legends | Never | Total XP | Recognize dedication |
| Streak Kings | Real-time | Current streak | Promote consistency |
| Rising Stars | Weekly | % improvement week-over-week | Reward growth |

### Local Leaderboards
- **City rankings** - "Top Hunter in Seattle"
- **Country rankings** - "Rank #45 in USA"
- **Region rankings** - "Best in Pacific Northwest"

**Privacy:** Location is always opt-in, stored at city-level only

### Privacy Controls
| Setting | Description |
|---------|-------------|
| Anonymous Mode | Display as "Hunter-7392" instead of username |
| Friends Only | Only visible to approved friends |
| Public | Visible on all leaderboards |
| Hidden | Completely opt-out of rankings |

### Anti-Gaming Measures
- Daily XP cap per category
- Activity verification for suspicious patterns
- Report system for abuse
- Shadowban for repeat offenders

---

## 🎖️ Feature Deep Dive: Achievement System

### Badge Categories

#### 🏃 Activity Milestones
| Badge | Requirement | Rarity |
|-------|-------------|--------|
| First Steps | Complete 1 activity | Common |
| Getting Started | Complete 10 activities | Common |
| Dedicated Hunter | Complete 100 activities | Uncommon |
| True Hunter | Complete 500 activities | Rare |
| Shadow Monarch | Complete 1,000 activities | Epic |

#### 🔥 Streak Achievements
| Badge | Requirement | Rarity |
|-------|-------------|--------|
| Consistent | 7-day streak | Common |
| Determined | 30-day streak | Uncommon |
| Unstoppable | 100-day streak | Rare |
| Legendary | 365-day streak | Legendary |

#### 🎯 Category Master
| Badge | Requirement | Rarity |
|-------|-------------|--------|
| Strength Initiate | 50 Strength completions | Uncommon |
| Knowledge Seeker | 50 Knowledge completions | Uncommon |
| Social Butterfly | 50 Social completions | Uncommon |
| Wellness Guru | 50 Wellness completions | Uncommon |
| Career Climber | 50 Career completions | Uncommon |

#### ⭐ Special Badges
| Badge | Requirement | Rarity |
|-------|-------------|--------|
| Early Adopter | Joined in 2026 | Rare |
| Year Wrapped Pioneer | Shared first Year Wrapped | Rare |
| Guild Founder | Created a guild | Rare |
| Bug Hunter | Reported a valid bug | Uncommon |
| Community Champion | Helped 10 users | Rare |

---

## 📈 Success Metrics & KPIs

### Primary Metrics (North Stars)
| Metric | Q1 Target | Q2 Target | Q3 Target | Q4 Target |
|--------|-----------|-----------|-----------|-----------|
| Monthly Active Users (MAU) | 5,000 | 15,000 | 30,000 | 50,000 |
| Daily Active Users (DAU) | 1,500 | 5,000 | 10,000 | 15,000 |
| DAU/MAU Ratio | 30% | 33% | 33% | 30% |

### Engagement Metrics
| Metric | Target |
|--------|--------|
| 7-day retention | 40% |
| 30-day retention | 25% |
| 90-day retention | 15% |
| Avg session length | 2 minutes |
| Sessions per day | 1.5 |
| Activities logged/user/day | 3+ |

### Feature-Specific Metrics
| Feature | Metric | Target |
|---------|--------|--------|
| Streaks | % users with 7+ day streak | 30% |
| Leaderboards | % users checking weekly | 50% |
| Badges | Avg badges earned/user | 8 |
| Year Wrapped | Share rate | 30% of active users |
| Friends | Avg friends/user | 5 |

### Quality Metrics
| Metric | Target |
|--------|--------|
| App crash rate | < 0.1% |
| API response time (p95) | < 500ms |
| App store rating | 4.5+ |
| NPS score | 50+ |

---

## 💰 Future Monetization Strategy (2027+)

### Freemium Model

#### Free Tier (Forever Free)
- Full activity tracking
- Basic statistics
- Global leaderboards
- 5 streak freezes per month
- Standard badges
- Friend system (up to 50 friends)

#### Premium Tier ($4.99/month or $39.99/year)
- Advanced analytics & insights
- Unlimited streak freezes
- Exclusive premium badges
- Custom profile themes
- Priority support
- Extended history (beyond 1 year)
- API access for integrations
- Ad-free experience
- Early access to new features

### Monetization Principles
1. **No Pay-to-Win** - Premium users don't get XP advantages
2. **Core Always Free** - Tracking and leveling remain free forever
3. **Value Over Extraction** - Premium should feel valuable, not required
4. **Transparent** - Clear communication about what's free vs paid

### Revenue Projections (2027)
| Scenario | MAU | Conversion | ARPU | MRR |
|----------|-----|------------|------|-----|
| Conservative | 100K | 2% | $4 | $8K |
| Moderate | 200K | 3% | $4 | $24K |
| Optimistic | 500K | 5% | $4.50 | $112.5K |

---

## 🔧 Technical Considerations

### Infrastructure Requirements

#### Q1-Q2 2026
- Single MongoDB instance (sufficient for <50K users)
- Vercel deployment (serverless)
- Basic CDN for static assets

#### Q3-Q4 2026
- MongoDB Atlas cluster (replica set)
- Redis for leaderboard caching
- Dedicated image generation service
- Analytics pipeline (data warehouse)

### Performance Targets
| Operation | Target |
|-----------|--------|
| Page load (LCP) | < 2.5s |
| API response (p95) | < 500ms |
| Leaderboard query | < 100ms (cached) |
| Image generation | < 3s |

### Data Privacy & Compliance
- GDPR compliant (EU users)
- Data export functionality (user right)
- Account deletion (full data removal)
- Privacy-first location (city-level only)
- Optional anonymous mode

---

## 🚀 Immediate Action Items

### This Week
- [ ] Design streak system UI/UX
- [ ] Set up push notification infrastructure
- [ ] Create achievement badge designs
- [ ] Plan leaderboard database schema

### This Month
- [ ] Implement streak tracking
- [ ] Build notification service
- [ ] Design 20 launch badges
- [ ] Create leaderboard API endpoints
- [ ] Set up analytics tracking

### This Quarter
- [ ] Complete all MUST HAVE features
- [ ] Beta launch with 500 users
- [ ] Gather feedback and iterate
- [ ] Prepare for Q2 social features

---

## 📝 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-31 | Product Team | Initial product plan |

---

## 🤝 Contributing

This is a living document. To propose changes:
1. Create a new branch
2. Update relevant sections
3. Submit a PR with rationale
4. Get approval from product owner

---

*"I alone level up." - And so can you.*
