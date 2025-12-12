# Supabase Setup Instructions

Follow these steps to connect your frontend to a live database.

## 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Name your project (e.g., "Conference Nights").
4. Set a database password and choose a region close to you.
5. Click **"Create new project"**.

## 2. Setup the Database
1. Once the project is ready (it takes a minute), go to the **SQL Editor** (icon with `>_` on the left sidebar).
2. Click **"New query"**.
3. You can name this query **"Database Setup"** (click the "Untitled query" text at the top to rename).
4. Open the file `supabase_setup.sql` in this code editor.
5. Copy the entire content of `supabase_setup.sql`.
6. Paste it into the Supabase SQL query window.
7. Click **"Run"** (bottom right of the query window).
   - You should see "Success" in the results area.

## 3. Get Your API Keys
1. Go to **Project Settings** (gear icon on the bottom left).
2. Click on **API**.
3. Look for the **Project URL** and **anon public** key.

## 4. Connect the App
1. Open the file `supabaseClient.ts` in this project.
2. Replace the placeholder values with your actual keys:

```typescript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 5. Seed Data (Optional)
1. Once connected, open your website preview.
2. If the database is empty, you will see a "No Data Available" message on the home screen.
3. Click the **"Reset Demo Data"** button. This will populate your new Supabase database with the sample data from `constants.ts`.