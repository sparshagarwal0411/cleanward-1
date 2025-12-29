# Fix: 401 "Missing authorization header" Error

## The Problem

Your `.env` file has **quotes around the anon key**, which breaks the authorization header.

## Quick Fix

### Step 1: Remove Quotes from .env

Your current `.env` has:
```env
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Change it to** (remove the quotes):
```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Update Your .env File

Your `.env` should look like this (NO quotes):
```env
VITE_SUPABASE_URL=https://pauyfhykkxfgqftxjmyg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhdXlmaHlra3hmZ3FmdHhqbXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDgwMTAsImV4cCI6MjA4MjUyNDAxMH0.As3EAA6KzOeJEb7Q_WKlyNP3nOQL-R7x1f3qxKrKgWw
```

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## What I Fixed

I've updated the code to automatically strip quotes from environment variables, but it's better to remove them from your `.env` file directly.

## After Fixing

- ✅ Authorization header will be sent correctly
- ✅ Edge Function will work
- ✅ Real-time pollution data will load


