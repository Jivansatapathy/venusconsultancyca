# YouTube Gallery Integration Setup Guide

This guide will help you set up the YouTube video integration in your Gallery section.

## Prerequisites

1. **YouTube Channel ID**: You need your YouTube Channel ID
2. **Google Cloud Project**: You need a Google Cloud project with YouTube Data API v3 enabled
3. **YouTube API Key**: You need an API key from Google Cloud Console

## Step 1: Get Your YouTube Channel ID

There are several ways to find your YouTube Channel ID:

1. **From YouTube Studio**:
   - Go to https://studio.youtube.com
   - Click on "Settings" (gear icon)
   - Click on "Channel" → "Advanced settings"
   - Your Channel ID will be displayed there

2. **From Your Channel URL**:
   - If your channel URL is: `https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxx`
   - The Channel ID is: `UCxxxxxxxxxxxxxxxxxxxxx`

3. **Using Online Tools**:
   - Visit: https://commentpicker.com/youtube-channel-id.php
   - Enter your channel URL or username

## Step 2: Get YouTube Data API Key

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**:
   - Create a new project or select an existing one

3. **Enable YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it and click "Enable"

4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (you can restrict it later for security)

5. **Optional: Restrict API Key** (Recommended for Production):
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Save the changes

## Step 3: Configure Environment Variables

### Backend Configuration (Server)

Add to your `server/.env` file:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Frontend Configuration (Client)

Add to your `client/.env` file:

```env
VITE_YOUTUBE_CHANNEL_ID=your_youtube_channel_id_here
```

**Example:**
```env
VITE_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxx
```

## Step 4: Restart Your Servers

After adding the environment variables:

1. **Restart the backend server**:
   ```bash
   cd server
   npm start
   ```

2. **Restart the frontend** (if in development):
   ```bash
   cd client
   npm run dev
   ```

## How It Works

1. **Automatic Fetching**: The Gallery page automatically fetches videos from your YouTube channel when it loads

2. **Auto-Refresh**: Videos are automatically refreshed every 5 minutes to show newly uploaded videos

3. **Manual Refresh**: Users can click the "🔄 Refresh Videos" button in the hero section to manually refresh videos

4. **Video Display**: 
   - Videos appear in a dedicated "Our Videos" section at the top of the gallery
   - Each video shows a thumbnail with a play button overlay
   - Clicking a video opens a modal with an embedded YouTube player

## Features

- ✅ Automatic video fetching from your YouTube channel
- ✅ Auto-refresh every 5 minutes
- ✅ Manual refresh button
- ✅ Video thumbnails with play button overlay
- ✅ Embedded video player in modal
- ✅ Video metadata (views, publish date, description)
- ✅ Direct link to watch on YouTube
- ✅ Responsive design for mobile and desktop

## Troubleshooting

### Videos Not Showing

1. **Check Environment Variables**:
   - Verify `YOUTUBE_API_KEY` is set in `server/.env`
   - Verify `VITE_YOUTUBE_CHANNEL_ID` is set in `client/.env`

2. **Check API Key**:
   - Ensure YouTube Data API v3 is enabled in Google Cloud Console
   - Verify the API key is correct and not restricted incorrectly

3. **Check Channel ID**:
   - Verify the Channel ID is correct (starts with "UC")
   - Try fetching videos manually: `GET /api/youtube/videos?channelId=YOUR_CHANNEL_ID`

4. **Check Browser Console**:
   - Open browser developer tools (F12)
   - Check the Console tab for error messages
   - Check the Network tab for API request failures

### API Quota Exceeded

YouTube Data API has a daily quota:
- Default quota: 10,000 units per day
- Each video list request uses ~1-2 units
- If you exceed the quota, videos won't load until the next day

**Solutions**:
- Reduce the refresh interval (currently 5 minutes)
- Implement caching on the backend
- Request a quota increase from Google Cloud Console

### CORS Errors

If you see CORS errors:
- Ensure your frontend URL is in the `CORS_ALLOWED_ORIGINS` in `server/.env`
- Check that the backend is properly configured to allow your frontend origin

## API Endpoints

The following endpoints are available:

- `GET /api/youtube/videos?channelId=CHANNEL_ID&maxResults=50`
  - Fetches videos from a YouTube channel
  - Returns up to 50 videos (default)

- `GET /api/youtube/videos/by-username?username=USERNAME&maxResults=50`
  - Alternative endpoint using channel username
  - Note: Username must match the channel's custom URL

## Security Notes

1. **API Key Security**:
   - Never commit API keys to version control
   - Use environment variables for all sensitive data
   - Restrict API keys in production to specific APIs and IPs

2. **Rate Limiting**:
   - The backend has rate limiting enabled (200 requests per 15 minutes)
   - This helps prevent abuse of the YouTube API

3. **CORS**:
   - Only allowlisted origins can access the API
   - Configure `CORS_ALLOWED_ORIGINS` properly

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs for API errors
3. Verify all environment variables are set correctly
4. Test the API endpoint directly using a tool like Postman

