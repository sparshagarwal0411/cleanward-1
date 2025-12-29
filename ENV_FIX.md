# Fix: Login Not Working - Wrong Supabase Project

## The Problem

Your `.env` file is pointing to the **AQI/pollution data project**, but login requires the **authentication project** (where the `users` table exists).

## Solution

You need to use the **authentication project** URL in your `.env` file.

### Step 1: Identify Your Projects

You likely have two Supabase projects:
1. **Authentication Project** - Has the `users` table, where you registered users
2. **AQI/Pollution Project** - Has the Edge Function for pollution data

### Step 2: Update .env File

Use the **authentication project** credentials:

```env
VITE_SUPABASE_URL=https://your-auth-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-auth-project-anon-key
```

### Step 3: Verify Which Project Has What

**Authentication Project should have:**
- ✅ `users` table (run migrations if not)
- ✅ Authentication enabled
- ✅ Users registered in Authentication > Users

**To check:**
1. Go to Supabase Dashboard
2. Check if `users` table exists (Table Editor)
3. Check if users exist (Authentication > Users)

### Step 4: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## If You Want Both to Work

**Option 1: Merge Everything (Recommended)**
- Use the authentication project for everything
- Deploy the Edge Function to the authentication project:
  ```bash
  supabase link --project-ref your-auth-project-id
  supabase functions deploy fetch-pollution-data
  ```

**Option 2: Keep Separate (Not Recommended)**
- Use authentication project URL in `.env` (for login to work)
- Edge Function won't work until deployed to auth project
- You'll see mock data until Edge Function is deployed

## Quick Check

After updating `.env` and restarting, check browser console:
- Should see: `🔗 Using Supabase project: your-auth-project-id`
- Login should work now


