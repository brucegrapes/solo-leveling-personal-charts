# Solo Leveling Progress Tracker - Product Plan

> **Document Version:** 1.0  
> **Last Updated:** December 31, 2025  
> **Status:** Active

---

## 🎯 Vision & Value Proposition

### Vision
Level up your real life, break bad habits, and grow with a fiercely competitive, supportive community—Solo Leveling style. Our platform transforms self-improvement into an epic, gamified journey, making personal growth fun, social, and as competitive as hell. Every user is both a solo challenger and a rival to others, driving each other to new heights.

### What Makes Us Unique

- **Solo Leveling Theme:** Inspired by the iconic manhwa, users become their own Sung Jin-Woo, tracking progress, gaining XP, and leveling up in real life.
- **Target Audience:**
	- Individuals seeking self-improvement and habit change
	- Gamers and anime/manhwa fans who want to gamify their lives
	- People who find traditional habit trackers boring
	- Data and analytics enthusiasts
**Community-Driven, Competitive Growth:**
	- Users give each other “Aura Points” (like social media likes) as encouragement and recognition.
	- Compliments, rivalries, and support foster a positive, growth-oriented, and competitive environment.
	- **Rival System:** Add users as friends to level up together, or as rivals to push each other to new heights. Friends can also be rivals—rivals are those who bring out your best through healthy competition and direct comparison.
- **Smart Grouping & Feeds:**
	- Users are algorithmically grouped with others in similar situations (e.g., basketball players see and compete with each other).
> "Level up your life, break bad habits, and grow with a fiercely competitive, supportive community—one Aura Point at a time. Level up with friends, and push your limits with rivals."
| S1 | 👥 Friend System | Add friends, see their progress, challenge rivals | High |
| S1 | 👥 Friend & Rival System | Add friends, see their progress, add rivals (including friends), challenge and compare with rivals | High |
├── Friend & rival system and challenges
**Key Deliverables:**
- [ ] Friend and rival add/remove/block/challenge functionality
	- Leaderboards reflect not just XP, but also community impact, support given/received, and competitive achievements.

### Core Value Proposition
> "Level up your life, break bad habits, and grow with a fiercely competitive, supportive community—one Aura Point at a time."

### Competitive Advantage
| Competitor | Their Focus | Our Differentiation |
|------------|-------------|---------------------|
| Habitica | Generic RPG gamification | Solo Leveling theme, modern UI, algorithmic grouping, Aura Points, community-driven growth |
| Streaks | Simple habit tracking | Deeper gamification, social support, personalized feeds |
| Daylio | Mood tracking | Action-focused, competitive and supportive elements |
| Strava | Fitness only | All life categories, unified leveling, peer encouragement |

---

## 📊 MoSCoW Prioritization

### 🔴 MUST HAVE (MVP - Q1 2026)
*Absolutely essential for a competitive, community-driven launch*

| ID | Feature | Description | Status | Effort |
|----|---------|-------------|--------|--------|
| M1 | Core Tracking | Daily activity logging with categories & sub-goals | ✅ Done | - |
| M2 | XP & Leveling System | Points system with level progression | ✅ Done | - |
| M3 | Stats Dashboard | View progress, streaks, completion rates | ✅ Done | - |
| M4 | Mobile PWA | Installable app for quick daily access | ✅ Done | - |
| M5 | User Authentication | Secure accounts with data persistence | ✅ Done | - |
| M6 | Streak System | Track consecutive days, streak freezes | ✅ Done | - |
| M7 | Global & Local Leaderboards | Compete in weekly/monthly/all-time, city/country/interest-based rankings | ✅ Done | - |
| M8 | Aura Points & Compliments | Give/receive Aura Points and compliments to boost and challenge others | ✅ Done | - |
| M9 | Smart Grouping | Algorithmic grouping for relevant, competitive feeds | ✅ Done | - |
| M10 | Systematic Ranking | Rank/rate others, see your competitive standing | ✅ Done | - |
| M6 | Streak System | Track consecutive days, streak freezes | ✅ Done | - |
| M7 | Global & Local Leaderboards | Compete in weekly/monthly/all-time, city/country/interest-based rankings | ✅ Done | - |
| M8 | Aura Points & Compliments | Give/receive Aura Points and compliments to boost and challenge others | ✅ Done | - |
| M9 | Smart Grouping | Algorithmic grouping for relevant, competitive feeds | ✅ Done | - |
| M10 | Systematic Ranking | Rank/rate others, see your competitive standing | ✅ Done | - |
| M11 | Notifications | Push reminders to log activities, streaks, and challenges | ✅ Done | - |
| M12 | Achievement Badges | Unlock badges for milestones, streaks, and competitive feats | 🔲 Planned | Medium |
| M13 | Data Export | Export your data (JSON/CSV) - trust & ownership | 🔲 Planned | Low |
**Key Deliverables:**
- [] Streak tracking with visual indicators
- [x] 3 free streak freezes per month
- [x] Web push notification setup
- [ ] Achievement badge system (MVP)
- [ ] Data export functionality (MVP)
- [x] Aura Points and compliment system
- [x] Global/local leaderboards and smart grouping
- [x] Systematic ranking and achievement badges
- [] Beta user onboarding (target: 500 users)

### 🟠 SHOULD HAVE (Q2 2026)

*High-value features to supercharge competition and engagement*

| ID | Feature | Description | Effort |
|----|---------|-------------|--------|
| S1 | 👥 Friend System | Add friends, see their progress, challenge rivals | High |
| S2 | 📈 Advanced Analytics | Weekly trends, category breakdowns, competitive insights | Medium |
| S3 | 🎨 Hunter Ranks | E → S rank progression with visual rewards | Low |
| S4 | 🔔 Smart Reminders | Context-aware notifications based on patterns | Medium |
| S5 | 📱 Native Feel | Haptic feedback, smooth animations | Low |
| S6 | 🎯 Challenges | Weekly/monthly community and personal challenges | Medium |
| S7 | 🏆 Competitive Events | Tournaments, boss raids, and leaderboard resets | High |

### 🟡 COULD HAVE (Q3-Q4 2026)

*Nice-to-haves for next-level competition, engagement, and fun*

| ID | Feature | Description | Effort |
|----|---------|-------------|--------|
| C1 | 🎁 Year Wrapped | Annual summary with competitive stats and shareable cards | High |
| C2 | ⚔️ Guild System | Create/join teams, group and inter-guild challenges | Very High |
| C3 | 🤖 AI Insights | "You're most productive on Tuesdays" and competitive analysis | Medium |
| C4 | 🛒 Cosmetic Shop | Spend earned coins on profile customization | Medium |
| C5 | 📊 Public Profiles | Shareable achievement and ranking pages | Low |
| C6 | 🔗 Integrations | Sync with Strava, Apple Health, Google Fit | Very High |
| C7 | 🌙 Dark Dungeons | Special limited-time events with bonus XP and rare rewards | Medium |

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

### Q1 2026: Competitive Foundation
```
├── Streak system with freeze tokens
├── Push notifications (PWA)
├── Data export
├── Aura Points, compliments, and rivalries
├── Global/local leaderboards and smart grouping
├── Systematic ranking and achievement badges
├── Bug fixes & polish
└── Soft launch (beta users)
```

**Key Deliverables:**
- [x] Streak tracking with visual indicators
- [x] 3 free streak freezes per month
- [x] Web push notification setup
- [x] JSON/CSV export functionality
- [x] Aura Points and compliment system
- [x] Global/local leaderboards and smart grouping
- [x] Systematic ranking and achievement badges
- [x] Beta user onboarding (target: 500 users)

### Q2 2026: Social, Rivalry & Events
```
├── Friend system and rival challenges
├── Advanced analytics and competitive insights
├── Hunter rank system (E to S)
├── Weekly/monthly challenges and events
├── Tournaments and boss raids (beta)
├── Marketing push
```

**Key Deliverables:**
- [ ] Friend add/remove/block/challenge functionality
- [ ] Advanced analytics and competitive insights
- [ ] Hunter rank progression (E, D, C, B, A, S)
- [ ] Weekly/monthly challenge system
- [ ] Tournament and boss raid beta
- [ ] Launch marketing campaign

### Q3 2026: Insights, Guilds & Engagement
```
├── Year Wrapped (competitive stats, shareable)
├── AI-powered insights and competitive analysis
├── Guild system and inter-guild challenges
├── Cosmetic shop and public profiles
├── Local leaderboards and opt-in location
```

**Key Deliverables:**
- [ ] Year Wrapped card generation system (with competitive stats)
- [ ] AI/ML insights engine
- [ ] Guild creation, management, and inter-guild challenges
- [ ] Cosmetic shop and public profiles
- [ ] Location-based leaderboards (opt-in)

### Q4 2026: Community, Events & Expansion
```
├── Full Year Wrapped launch
├── Boss raids and seasonal events
├── Dark Dungeons (limited-time competitive events)
├── Integrations (Strava, Apple Health, Google Fit)
├── 2027 planning
```

**Key Deliverables:**
- [ ] Year Wrapped public launch with sharing
- [ ] Boss raid and seasonal event system
- [ ] Dark Dungeons and special competitive events
- [ ] Integrations with fitness platforms
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
- [ ] Finalize competitive streak, leaderboard, and Aura Point UI/UX
- [ ] Launch and test Aura Point and compliment system
- [ ] Polish achievement badge and ranking visuals
- [ ] Review and optimize smart grouping and feed algorithms

### This Month
- [ ] Launch friend/rival system and challenge features
- [ ] Release advanced analytics and competitive insights
- [ ] Prepare and test tournament and boss raid beta
- [ ] Expand marketing and community engagement

### This Quarter
- [ ] Complete all competitive MVP features
- [ ] Beta launch with 500+ users
- [ ] Gather feedback, iterate, and optimize for competition
- [ ] Prepare for Q2 social, rivalry, and event features

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
