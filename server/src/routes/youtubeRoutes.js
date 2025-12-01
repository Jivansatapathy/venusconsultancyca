// server/src/routes/youtubeRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Get YouTube videos from a channel
router.get("/videos", async (req, res) => {
  try {
    const { channelId, maxResults = 50 } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "YouTube API key not configured. Please set YOUTUBE_API_KEY in environment variables." 
      });
    }

    if (!channelId) {
      return res.status(400).json({ 
        error: "Channel ID is required. Provide it as a query parameter: ?channelId=YOUR_CHANNEL_ID" 
      });
    }

    // First, get the uploads playlist ID from the channel
    const channelResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "contentDetails",
          id: channelId,
          key: apiKey,
        },
      }
    );

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return res.status(404).json({ error: "Channel not found. Please check your channel ID." });
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from the uploads playlist
    const videosResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet,contentDetails",
          playlistId: uploadsPlaylistId,
          maxResults: parseInt(maxResults),
          key: apiKey,
        },
      }
    );

    // Get additional video details (statistics, duration, etc.)
    const videoIds = videosResponse.data.items.map(
      (item) => item.contentDetails.videoId
    );

    let videoDetails = [];
    if (videoIds.length > 0) {
      const detailsResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,statistics,contentDetails",
            id: videoIds.join(","),
            key: apiKey,
          },
        }
      );
      videoDetails = detailsResponse.data.items;
    }

    // Combine playlist items with video details
    const videos = videosResponse.data.items.map((item, index) => {
      const details = videoDetails[index] || {};
      return {
        id: item.contentDetails.videoId,
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        viewCount: details.statistics?.viewCount || 0,
        likeCount: details.statistics?.likeCount || 0,
        duration: details.contentDetails?.duration || "",
        embedUrl: `https://www.youtube.com/embed/${item.contentDetails.videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
      };
    });

    res.json({
      success: true,
      videos,
      total: videos.length,
    });
  } catch (error) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch YouTube videos",
      message: error.response?.data?.error?.message || error.message,
    });
  }
});

// Alternative endpoint: Get videos by channel username (requires channel custom URL)
router.get("/videos/by-username", async (req, res) => {
  try {
    const { username, maxResults = 50 } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "YouTube API key not configured" 
      });
    }

    if (!username) {
      return res.status(400).json({ 
        error: "Username is required" 
      });
    }

    // First, get channel ID from username
    const channelResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "contentDetails",
          forUsername: username,
          key: apiKey,
        },
      }
    );

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const channelId = channelResponse.data.items[0].id;
    
    // Redirect to the channel ID endpoint
    return res.redirect(`/api/youtube/videos?channelId=${channelId}&maxResults=${maxResults}`);
  } catch (error) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch YouTube videos",
      message: error.response?.data?.error?.message || error.message,
    });
  }
});

export default router;

