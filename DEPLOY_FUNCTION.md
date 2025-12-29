# Deploy Edge Function to Fix CORS

## Your Situation

- ✅ Your project: `pauyfhykkxfgqftxjmyg` (has login/users table)
- ✅ Edge Function code is ready with CORS headers
- ❌ Getting CORS errors because function needs to be deployed

## Quick Fix: Deploy the Function

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref pauyfhykkxfgqftxjmyg
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy fetch-pollution-data
   ```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard: `pauyfhykkxfgqftxjmyg`
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it: `fetch-pollution-data`
5. Copy the entire contents of `supabase/functions/fetch-pollution-data/index.ts`
6. Paste it into the function editor
7. Click **Deploy**

## Verify It Works

After deploying, test the function:
- Open: `https://pauyfhykkxfgqftxjmyg.supabase.co/functions/v1/fetch-pollution-data`
- Should return JSON with pollution data (no CORS error)

## Make Sure Your .env Points to Your Project

Your `.env` should be:
```env
VITE_SUPABASE_URL=https://pauyfhykkxfgqftxjmyg.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-for-pauyfhykkxfgqftxjmyg
```

## After Deployment

1. Restart your dev server
2. Check browser console - should see real pollution data
3. No more CORS errors!


