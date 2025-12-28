# Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for the CleanWard application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. Supabase CLI (optional, for local development)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `cleanward` (or your preferred name)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be set up (this may take a few minutes)

## Step 2: Run Database Migration

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the contents of `supabase/migrations/20240101000000_create_users_table.sql`
5. Click "Run" to execute the migration
6. You should see a success message

### Option B: Using Supabase CLI (For advanced users)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push migrations:
   ```bash
   supabase db push
   ```

## Step 3: Configure Environment Variables

1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy the following values:
   - Project URL (under "Project URL")
   - Anon/Public Key (under "Project API keys" > "anon" > "public")

3. Create a `.env` file in the root of your project (if it doesn't exist):
   ```env
   VITE_SUPABASE_URL=your-project-url-here
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Replace the placeholder values with your actual Supabase credentials

## Step 4: Enable Email Authentication

1. In your Supabase dashboard, go to "Authentication" > "Providers"
2. Make sure "Email" provider is enabled
3. Configure email settings if needed (for production, set up SMTP)

## Step 5: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the registration page (`/auth`)
3. Try creating a test account
4. Check your Supabase dashboard:
   - Go to "Authentication" > "Users" to see the new user
   - Go to "Table Editor" > "users" to see the user profile data

## Database Schema

The `users` table has the following structure:

- `id` (UUID, Primary Key) - References `auth.users(id)`
- `first_name` (TEXT) - User's first name
- `last_name` (TEXT) - User's last name
- `email` (TEXT, Unique) - User's email address
- `phone` (TEXT, Nullable) - User's phone number
- `age` (INTEGER, Nullable) - User's age
- `sex` (TEXT, Nullable) - User's sex (male/female/other)
- `gender` (TEXT, Nullable) - User's gender identity
- `ward_number` (INTEGER) - User's ward number (1-250)
- `role` (TEXT) - User role (citizen/admin)
- `created_at` (TIMESTAMP) - Account creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Row Level Security (RLS)

The table has Row Level Security enabled with the following policies:

- Users can view their own data
- Users can update their own data
- Users can insert their own data

This ensures users can only access and modify their own profile information.

## Troubleshooting

### Issue: "relation 'users' does not exist"
**Solution**: Make sure you've run the migration SQL script in the Supabase SQL Editor.

### Issue: "new row violates row-level security policy"
**Solution**: 
1. Run the additional migration file `supabase/migrations/20240101000001_fix_rls_policy.sql` in your Supabase SQL Editor
2. This migration creates a database function that bypasses RLS for user registration
3. The code will automatically use this function if available, otherwise it will try direct insert
4. Make sure you've run BOTH migration files in order:
   - First: `20240101000000_create_users_table.sql`
   - Second: `20240101000001_fix_rls_policy.sql`

### Issue: "duplicate key value violates unique constraint"
**Solution**: The email address is already registered. Use a different email or try logging in instead.

### Issue: Environment variables not working
**Solution**: 
1. Make sure your `.env` file is in the root directory
2. Restart your development server after adding/changing environment variables
3. Check that variable names start with `VITE_` (required for Vite)

## Next Steps

- Set up email templates for authentication emails
- Configure SMTP for production email sending
- Add additional tables as needed (e.g., goals, achievements, reports)
- Set up database backups
- Configure API rate limiting

## Support

For more information, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

