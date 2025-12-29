# Update Your .env File

## Current Situation

✅ **Edge Function is working** on: `yohxdixwidncajzvekur.supabase.co`
❌ **Your .env points to**: `pauyfhykkxfgqftxjmyg.supabase.co`

## Solution

Update your `.env` file to use the `yohxdixwidncajzvekur` project:

```env
VITE_SUPABASE_URL=https://yohxdixwidncajzvekur.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-for-yohxdixwidncajzvekur
```

## Steps

1. **Get the credentials from `yohxdixwidncajzvekur` project:**
   - Go to Supabase Dashboard
   - Select project: `yohxdixwidncajzvekur`
   - Go to Settings → API
   - Copy:
     - Project URL: `https://yohxdixwidncajzvekur.supabase.co`
     - anon/public key

2. **Update your `.env` file** with those values

3. **Make sure this project has:**
   - ✅ `users` table (run migrations if needed)
   - ✅ Authentication enabled
   - ✅ Edge Function deployed (already done ✅)

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## Verify

After updating, check browser console:
- Should see: `🔗 Using Supabase project: yohxdixwidncajzvekur`
- Edge Function should work without CORS errors
- Login should work (if users table exists in this project)


