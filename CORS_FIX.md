# Fix: CORS Error with Edge Function

## The Problem

You're getting a CORS error because:
1. The Edge Function is deployed to project `pauyfhykkxfgqftxjmyg` (AQI project)
2. Your `.env` might be pointing to a different project
3. The OPTIONS preflight request is failing

## Solutions

### Option 1: Deploy Edge Function to Your Auth Project (Recommended)

1. Make sure your `.env` points to your **authentication project** (where users table exists)
2. Deploy the Edge Function to that same project:
   ```bash
   supabase link --project-ref your-auth-project-id
   supabase functions deploy fetch-pollution-data
   ```

### Option 2: Fix CORS in Current Project

The Edge Function code has been updated with better CORS headers. If you want to keep using the AQI project:

1. Redeploy the updated function:
   ```bash
   supabase link --project-ref pauyfhykkxfgqftxjmyg
   supabase functions deploy fetch-pollution-data
   ```

2. Make sure your `.env` points to the same project:
   ```env
   VITE_SUPABASE_URL=https://pauyfhykkxfgqftxjmyg.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key-for-this-project
   ```

### Option 3: Use Mock Data (Temporary)

If you just want to test without real-time data:
- The app will automatically fall back to mock data if the Edge Function fails
- You'll see "Mock Data" badge on the map
- Login will still work if `.env` points to auth project

## Best Practice

**Use ONE project for everything:**
- Authentication (users table)
- Edge Functions (pollution data)
- All database operations

This avoids CORS issues and simplifies configuration.


