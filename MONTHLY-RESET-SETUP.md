# 🔄 Monthly Progress Reset Setup Guide

This guide explains how to set up automatic monthly progress reset for your Sherpa Boulder Progress application.

## 📋 Overview

Your climbing club can automatically reset all user boulder progress at the beginning of each month using three different approaches:

1. **🤖 Automatic with Supabase Edge Functions** (Recommended)
2. **📅 Manual with SQL Scripts** (Simple)
3. **💾 Archival Approach** (Preserves history)

---

## Option 1: 🤖 Automatic Reset (Recommended)

### Prerequisites
- Supabase CLI installed
- Your Supabase project set up
- Free tier supports Edge Functions with limitations

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Initialize Supabase in your project
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Deploy the database changes
Run the main reset SQL script in your Supabase SQL Editor:
```bash
# Copy and paste the contents of supabase-monthly-reset.sql
# into your Supabase SQL Editor and execute
```

### Step 4: Set up environment variables in Supabase
In your Supabase Dashboard → Edge Functions → Settings:
```env
MONTHLY_RESET_SECRET=your_super_secret_key_here_12345
```

### Step 5: Deploy the Edge Function
```bash
supabase functions deploy monthly-reset
```

### Step 6: Set up the cron job
Unfortunately, Supabase free tier doesn't include native cron jobs. Use one of these alternatives:

#### Option A: GitHub Actions (Free)
Create `.github/workflows/monthly-reset.yml`:
```yaml
name: Monthly Boulder Progress Reset
on:
  schedule:
    # Runs at 6 AM on the 1st day of every month (Mexico City time)
    - cron: '0 11 1 * *'  # UTC time (6 AM Mexico City = 11 AM UTC)
  workflow_dispatch:  # Allows manual trigger

jobs:
  reset-progress:
    runs-on: ubuntu-latest
    steps:
      - name: Call Supabase Edge Function
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.MONTHLY_RESET_SECRET }}" \
            -H "Content-Type: application/json" \
            -d '{"source": "github-actions", "month": "auto"}' \
            https://YOUR_PROJECT_REF.supabase.co/functions/v1/monthly-reset
```

Add `MONTHLY_RESET_SECRET` to your GitHub repository secrets.

#### Option B: External Cron Service
Use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier)
- **Zapier** (free tier)

Set them to call:
```
POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/monthly-reset
Headers: Authorization: Bearer YOUR_MONTHLY_RESET_SECRET
```

---

## Option 2: 📅 Manual Reset (Simplest)

### For Simple Reset (No History)
1. Open Supabase SQL Editor
2. Copy and paste `supabase-simple-monthly-reset.sql`
3. Uncomment the DELETE line
4. Execute on the 1st of each month

### For Reset with Archive
1. Open Supabase SQL Editor
2. Copy and paste `supabase-monthly-reset.sql`
3. Execute the entire script
4. This will archive old data and reset progress

---

## Option 3: 💾 Archival Approach (Preserves History)

This approach keeps historical data while resetting current progress.

### Features
- ✅ Preserves all historical boulder completion data
- ✅ Allows viewing past months' progress
- ✅ Creates monthly statistics and reports
- ✅ Safe reset with data backup

### Setup
1. Run `supabase-monthly-reset.sql` in Supabase SQL Editor
2. This creates:
   - `user_progress_archive` table
   - `monthly_progress_reset()` function
   - `get_archived_progress()` function
   - `current_month_stats` view

### Usage
```sql
-- View current month stats
SELECT * FROM current_month_stats;

-- Get archived progress for January 2024
SELECT * FROM get_archived_progress(1, 2024);

-- Manual reset (archives current data and clears progress)
SELECT monthly_progress_reset();
```

---

## 🚀 Testing Your Setup

### Test the Edge Function manually:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_MONTHLY_RESET_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source": "test", "month": "auto"}' \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/monthly-reset
```

### Expected Response:
```json
{
  "success": true,
  "message": "Monthly progress reset completed successfully",
  "details": {
    "archived_records": 45,
    "deleted_records": 45,
    "reset_month": 1,
    "reset_year": 2024,
    "reset_timestamp": "2024-01-01T06:00:00.000Z"
  }
}
```

---

## 📊 Monitoring & Notifications

### View Supabase Logs
- Go to Supabase Dashboard → Edge Functions → Logs
- Monitor the monthly-reset function execution

### Optional: Add Discord/Slack Notifications
Edit the Edge Function to send notifications:
```typescript
// Add to the Edge Function after successful reset
const discordWebhook = "YOUR_DISCORD_WEBHOOK_URL"
await fetch(discordWebhook, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: `🔄 Monthly boulder progress reset completed! 
    📁 Archived: ${result.archived_records} records
    🏔️ Ready for new climbing challenges!`
  })
})
```

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Supabase Free Tier**: 500MB database, 2GB bandwidth/month
- **Edge Functions**: 500K invocations/month (more than enough for monthly resets)
- **GitHub Actions**: 2,000 minutes/month (plenty for monthly jobs)

### Data Safety
- ✅ **Always backup** before running resets
- ✅ **Test first** with a small dataset
- ✅ **Monitor logs** for any errors
- ✅ **Keep archive tables** for historical data

### Timezone Considerations
- The cron schedule uses Mexico City time (UTC-6/-5 depending on DST)
- Adjust cron expressions for your timezone
- Edge Functions run in UTC, so convert accordingly

---

## 🐛 Troubleshooting

### Common Issues

#### "Function not found"
```bash
supabase functions deploy monthly-reset --no-verify-jwt
```

#### "Permission denied"
Check that the database function has proper grants:
```sql
GRANT EXECUTE ON FUNCTION public.monthly_progress_reset TO service_role;
```

#### "Environment variables missing"
Ensure all required variables are set in Supabase Dashboard.

### Support
- Check Supabase logs for detailed error messages
- Test the SQL functions directly in SQL Editor
- Verify authentication and permissions

---

## 📅 Recommended Schedule

**Automatic Reset Time**: 6:00 AM Mexico City Time on the 1st of each month

This gives climbers the full previous month to complete their boulders and starts the new month fresh for new challenges! 🧗‍♂️
