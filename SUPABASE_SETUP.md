# Supabase Setup Guide for Fur Finance

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the details:
   - **Organization**: Your organization
   - **Project name**: `fur-finance`
   - **Database password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for setup to complete (1-2 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 3: Set Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `supabase-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

## Step 5: Set Up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name it: `pet-photos`
4. Set it to **Public** (so images can be accessed)
5. Click "Create bucket"

## Step 6: Configure Storage Policies

Run this SQL in the SQL Editor to allow file uploads:

```sql
-- Allow authenticated users to upload pet photos
CREATE POLICY "Users can upload pet photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to pet photos
CREATE POLICY "Public access to pet photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'pet-photos');

-- Allow users to delete their own pet photos
CREATE POLICY "Users can delete their pet photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. The app should now use Supabase instead of localStorage
3. Try adding a pet with a photo to test file uploads

## Step 8: Deploy to Vercel

1. Add the environment variables to your Vercel project:
   - Go to your Vercel dashboard
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add the same variables from `.env.local`

## Migration from localStorage

The app will automatically:
- Create anonymous sessions for users
- Store all data in Supabase
- Handle file uploads for pet photos
- Maintain the same user experience

## Next Steps

After this setup, you can:
1. **Add real authentication** (email/password, social logins)
2. **Enable real-time features** (live updates across devices)
3. **Add user management** (multiple users per household)
4. **Implement offline support** (sync when online)

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Check that your environment variables are correct
   - Make sure you're using the `anon` key, not the `service_role` key

2. **"Table doesn't exist" error**
   - Make sure you ran the schema SQL in Supabase
   - Check that all tables were created successfully

3. **"Permission denied" error**
   - Check that Row Level Security policies are set up correctly
   - Verify that anonymous auth is enabled

4. **File upload fails**
   - Make sure the `pet-photos` bucket exists and is public
   - Check that storage policies are configured correctly

### Getting Help:

- Check the [Supabase documentation](https://supabase.com/docs)
- Look at the browser console for detailed error messages
- Verify your environment variables are loaded correctly 