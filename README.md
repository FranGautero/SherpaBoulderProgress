# 🧗‍♂️ Sherpa Boulder Progress

A digital boulder tracking system for climbing clubs. Transform your paper-based progress tracking into a modern, user-friendly web application.

## 🎯 Features

- ✅ **User Authentication** - Secure login/register with email verification
- ✅ **Boulder Grid Tracking** - Digital version of paper boulder sheets
- ✅ **Real-time Statistics** - Track progress by color, zone, and time
- ✅ **Monthly Reset System** - Fresh challenges each month
- ✅ **Mobile Responsive** - Works great on phones and tablets
- ✅ **200 User Limit** - Perfect for climbing clubs (Supabase free tier)

## 🏔️ Boulder Zones & Colors

Track your progress across different wall sections and difficulty levels:

### Wall Zones
- **Proa** - Front wall section
- **Popa** - Back wall section  
- **Babor** - Left wall section
- **Estribor** - Right wall section
- **Desplome de los Loros** - Parrot overhang
- **Amazonía** - Amazon section

### Difficulty Colors
- 🟢 **Verdes** (Green) - Beginner
- 🟡 **Amarillos** (Yellow) - Easy
- 🔴 **Rojos** (Red) - Intermediate
- 🟣 **Lilas** (Purple) - Advanced  
- ⚫ **Negros** (Black) - Expert

Each completed boulder = **100 points** 🏆

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database + Auth)
- **Deployment**: Vercel
- **Free Tier**: Everything runs on free tiers!

## 📋 Setup Instructions

### Prerequisites
- Node.js (18 or newer)
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install
\`\`\`bash
git clone https://github.com/FranGautero/SherpaBoulderProgress.git
cd SherpaBoulderProgress
npm install
\`\`\`

### 2. Setup Supabase
1. Create a new Supabase project
2. Run the SQL script in \`supabase-setup.sql\`
3. Copy your project URL and anon key

### 3. Environment Variables
\`\`\`bash
cp env.example .env.local
# Edit .env.local with your Supabase credentials
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see your boulder tracking system! 🎉

## 📊 Monthly Reset System

Keep your climbing club engaged with monthly challenges:

### Simple Manual Reset (Recommended)
1. Open Supabase SQL Editor
2. Copy script from \`supabase-simple-monthly-reset.sql\`
3. Uncomment the DELETE line
4. Execute on the 1st of each month

### Testing Reset System
Use \`test-monthly-reset.sql\` to safely test the reset functionality before running it live.

## 🔧 Database Schema

- **\`profiles\`** - User information and club membership
- **\`boulders\`** - Boulder routes by color and zone
- **\`user_progress\`** - Track which boulders users have completed

## 📱 Usage

1. **Register/Login** - Email verification required
2. **Select Boulders** - Use +/- buttons to track completions
3. **View Progress** - Real-time stats and monthly totals
4. **Monthly Reset** - Fresh start each month

## 🏆 Perfect for Climbing Clubs

- **Monthly Competitions** - Reset progress for fair challenges
- **Member Engagement** - Track and celebrate achievements  
- **Digital Modernization** - Replace paper tracking sheets
- **Cost Effective** - Free tier supports up to 200 members

## 🔐 Security & Privacy

- Row Level Security (RLS) enabled
- Users can only see their own progress
- Secure authentication with email verification
- No sensitive data stored

## 🤝 Contributing

This is a personal project for the Sherpa climbing club. Feel free to fork for your own climbing community!

## 📄 License

Personal project - Feel free to adapt for your climbing club.

---

**Made with ❤️ for the climbing community** 🧗‍♂️🏔️
