# Sherpa Boulder Progress - Setup Guide

This guide will help you set up and deploy your climbing club's boulder progress tracking application using Vercel (free tier) and Supabase (free tier).

## 📋 Overview

This application digitizes your paper-based boulder tracking system with:
- User authentication (login/register) with 200 user limit
- Boulder progress tracking grid matching your paper form
- Point system (100 points per boulder)
- User statistics and progress tracking
- Responsive design for desktop and mobile

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Configure Database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the script to create all tables, policies, and initial data

3. **Get Your API Keys**
   - Go to Settings → API
   - Copy your Project URL and anon public key

### Step 3: Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to test your application.

### Step 5: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   
3. **Set Environment Variables in Vercel**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add your Supabase URL and API key

## 🏗️ Architecture

### Database Schema

- **profiles**: User profiles (max 200 users) - references auth.users
- **boulders**: All possible boulder routes (5 colors × 6 zones = 30 boulders)
- **user_progress**: User completion records

### Boulder System

**Colors**: Verdes, Amarillos, Rojos, Lilas, Negros
**Zones**: Proa, Popa, Babor, Estribor, Desplome de los Loros, Amazonía

### Features

✅ User registration with 200 user limit
✅ Secure authentication
✅ Boulder completion tracking
✅ Point system (100 points per boulder)
✅ User statistics and progress
✅ Responsive design
✅ Spanish localization

## 🔧 Configuration

### User Limit

The application enforces a 200 user registration limit to stay within Supabase free tier limits. This is implemented in:
- Database function: `get_user_count()`
- Registration page: Checks count before allowing new registrations

### Customization

To modify boulder routes, colors, or zones:
1. Update the types in `src/types/index.ts`
2. Modify the constants in components
3. Update the database with new boulder combinations

## 🛠️ Free Tier Limitations

### Vercel Free Tier
- 100GB bandwidth per month
- Unlimited personal projects
- Automatic HTTPS

### Supabase Free Tier
- 500MB database storage
- 5GB bandwidth per month
- 50,000 monthly active users (we limit to 200)

## 📱 Usage

1. **Registration**: Users can register (up to 200 total)
2. **Login**: Secure authentication
3. **Boulder Tracking**: Click cells to mark completed boulders
4. **Progress**: View personal statistics and achievements

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure `.env.local` has correct Supabase credentials
2. **Database Setup**: Run the complete `supabase-setup.sql` script
3. **User Limit**: If registration fails, check if 200 user limit reached

### Support

This is a community project for your climbing club. For issues:
1. Check the browser console for errors
2. Verify Supabase connection
3. Confirm environment variables are set

## 🔮 Future Enhancements

Possible improvements within free tier limits:
- Boulder difficulty ratings
- Monthly challenges
- Club leaderboards
- Progress photos
- Route notes

---

**Built with ❤️ for the climbing community**
