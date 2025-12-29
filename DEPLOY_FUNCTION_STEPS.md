# Deploy Edge Function - Step by Step

## The Error
`{"code":"NOT_FOUND","message":"Requested function was not found"}`

This means the function **hasn't been deployed** to your Supabase project yet.

## Solution: Deploy the Function

### Method 1: Using Supabase Dashboard (Easiest)

1. **Go to your Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/pauyfhykkxfgqftxjmyg

2. **Navigate to Edge Functions**
   - Click "Edge Functions" in the left sidebar
   - Or go to: https://supabase.com/dashboard/project/pauyfhykkxfgqftxjmyg/functions

3. **Create the Function**
   - Click "Create a new function" button
   - **Function name**: `fetch-pollution-data` (exactly this name, with hyphens)
   - Click "Create function"

4. **Add the Code**
   - Open the file: `supabase/functions/fetch-pollution-data/index.ts`
   - Copy **ALL** the code from that file
   - Paste it into the function editor in Supabase Dashboard
   - Click "Deploy" button

5. **Verify**
   - After deployment, you should see the function in the list
   - Test it: https://pauyfhykkxfgqftxjmyg.supabase.co/functions/v1/fetch-pollution-data
   - Should return JSON data (not an error)

### Method 2: Using Supabase CLI

1. **Install CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref pauyfhykkxfgqftxjmyg
   ```

4. **Deploy**:
   ```bash
   supabase functions deploy fetch-pollution-data
   ```

## Important Notes

- ✅ Function name must be: `fetch-pollution-data` (with hyphens, not underscores)
- ✅ Make sure your `.env` points to: `pauyfhykkxfgqftxjmyg.supabase.co`
- ✅ After deploying, restart your dev server

## Verify Deployment

1. **Check in Dashboard**: Edge Functions → Should see `fetch-pollution-data`
2. **Test URL**: https://pauyfhykkxfgqftxjmyg.supabase.co/functions/v1/fetch-pollution-data
3. **Should return**: JSON with `{"success":true,...}`

## After Deployment

1. Restart your dev server
2. The app will automatically use the real-time data
3. No more "NOT_FOUND" errors!


