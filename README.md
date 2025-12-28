# Solo Leveling Personal Charts 🎯

A Solo Leveling anime-themed personal progress tracker with **cloud database storage and secure authentication**! Track your daily activities across multiple categories, gain experience, level up, earn titles, and access your data from any device, anywhere.

## ✨ Features

### 🔐 Authentication & Cloud Storage
- **Secure Login**: Username and password authentication
- **Cloud Database**: MongoDB database for persistent storage
- **Multi-Device Access**: Access your data from phone, laptop, tablet, or any device
- **Automatic Sync**: All changes save to the cloud automatically
- **Private Data**: Each user has their own secure account

### 📊 Activity Tracking
Track 6 key life categories:
  - 💪 Gym Progress
  - 📚 Book Reading
  - 💼 Office Work
  - 🧘 Mental Health
  - 😎 Coolness
  - 📝 Daily Life Notes

### 📖 Journal System
- Write daily journal entries for each day
- Review any day's notes in the History page
- Private journal visible only to you

- **Leveling System**: 
  - Gain 10 XP per completed task
  - Progressive difficulty (each level requires more XP)
  - Level 1: 100 XP, Level 2: 150 XP, Level 3: 200 XP, etc.

- **Dynamic Titles**:
  - E-Rank Hunter → S-Rank Hunter → Special Monarch Titles
  - Titles change based on your most completed activity
  - Special titles after level 60+ (Iron Body Monarch, Shadow Sage, etc.)

- **Visual Progress**:
  - Daily activity checkboxes
  - **Hexagon Radar Chart**: See activity balance at a glance
  - 30-day progress line chart
  - Total activity comparison bar chart
  - Real-time experience and level tracking
  - Current streak counter

### 📅 History & Journal Page
- **List View**: Browse all tracked days chronologically
- **Calendar View**: 30-day visual heatmap with color-coded activity levels
- View any past day's activities and journal entries
- Quick navigation between dates

- **Solo Leveling Theme**:
  - Dark blue, purple, and gold color scheme
  - Glowing effects on important elements
  - Anime-inspired UI design
- MongoDB (local or MongoDB Atlas account)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solo-leveling-personal-charts.git
cd solo-leveling-personal-charts
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database (see [SETUP.md](SETUP.md) for detailed instructions):
   - **Option A**: MongoDB Atlas (cloud, free, recommended)
   - **Option B**: Local MongoDB

4. Create `.env.local` file:
```bash
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```
Register/Login**: Create your account with username and password
2. **Daily Tracking**: Click on activity cards to mark them complete for today
3. **Write Journal**: Add daily notes in the journal section
4. **View Progress**: Click "View Charts" to see:
   - Hexagon balance chart
   - 30-day trends
   - Activity comparison
5. **Rontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (Line, Bar, Radar/Hexagon)
- **Authentication**: NextAuth.js v5
- **Database**: MongoDB
- **Security**: bcrypt password hashing, JWT sessions
- **Storage**: Cloud database (MongoDB Atlas) or local MongoDB

## 📊 Data Storage

- **Cloud Database**: All data stored in MongoDB
- **Secure**: Each user has private, encrypted data
- **Automatic Sync**: Changes save to cloud automatically
- **Multi-Device**: Access from anywhere with login

Your data includes:
- Daily activity completions
- Journal entries
- User stats (level, XP, streak, title)
- Complete hbash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Use

1. **Daily Tracking**: Click on activity cards to mark them complete for today
2. **View Progress**: Click "View Charts" to see your historical data
3. **Level Up**: Complete tasks daily to gain XP and level up
4. **Earn Titles**: Focus on specific activities to earn specialized titles

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Storage**: Browser localStorage

## 📊 Data Storage
Social features to compete with friends
- Custom activity creation
- Achievement/badge system
- Data export functionality
- Mobile app (React Native)
- Reminders and notifications
- Statistics dashboard with more insights
## 🎨 Customization

You can customize the activities by editing the `ACTIVITIES` array in [src/app/page.tsx](src/app/page.tsx):

```typescript
const ACTIVITIES: Activity[] = [
  { id: 'gym', name: 'Gym', icon: '💪' },
  // Add or modify activities here
];
```

## 🔮 Future Enhancements

- Backend integration for data persistence
- Mobile app version
- Social features to compete with friends
- Custom activity creation
- Achievement system
- Export/import data functionality

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

Inspired by the Solo Leveling manhwa/anime by Chugong.

---

**Start your journey from E-Rank to Shadow Monarch today!** 🌟
