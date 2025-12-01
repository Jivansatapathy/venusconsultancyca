// server/src/routes/youtubeRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Get YouTube videos from a channel
router.get("/videos", async (req, res) => {
  try {
    const { channelId, channelHandle, maxResults = 50 } = req.query;
    // Using API key directly for now - TODO: Move to environment variable
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBrGXFccE_qNIlL0k12KYNF8FJk1XNhx1A";

    if (!apiKey) {
      return res.status(500).json({ 
        error: "YouTube API key not configured. Please set YOUTUBE_API_KEY in environment variables." 
      });
    }

    let finalChannelId = channelId;

    // If channelHandle is provided, get the channel ID from it
    if (!finalChannelId && channelHandle) {
      // Remove @ symbol if present
      const handle = channelHandle.replace(/^@/, '');
      
      try {
        // Try using the search API to find channel by handle
        const searchResponse = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              q: handle,
              type: "channel",
              maxResults: 1,
              key: apiKey,
            },
          }
        );

        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          finalChannelId = searchResponse.data.items[0].id.channelId;
        } else {
          // Try using channels.list with forHandle (newer API method)
          try {
            const handleResponse = await axios.get(
              "https://www.googleapis.com/youtube/v3/channels",
              {
                params: {
                  part: "id",
                  forHandle: handle,
                  key: apiKey,
                },
              }
            );
            if (handleResponse.data.items && handleResponse.data.items.length > 0) {
              finalChannelId = handleResponse.data.items[0].id;
            }
          } catch (handleErr) {
            console.log("forHandle method not available, using search result");
          }
        }
      } catch (searchErr) {
        console.error("Error finding channel by handle:", searchErr.response?.data || searchErr.message);
        return res.status(404).json({ 
          error: "Channel not found", 
          message: `Could not find channel with handle: ${channelHandle}` 
        });
      }
    }

    if (!finalChannelId) {
      return res.status(400).json({ 
        error: "Channel ID or handle is required", 
        message: "Provide either channelId or channelHandle as a query parameter" 
      });
    }

    // First, get the uploads playlist ID from the channel
    const channelResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "contentDetails",
          id: finalChannelId,
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
    // Using API key directly for now - TODO: Move to environment variable
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBrGXFccE_qNIlL0k12KYNF8FJk1XNhx1A";

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

// Helper endpoint: Get channel ID from channel URL or handle
router.get("/channel-id", async (req, res) => {
  try {
    const { url, handle, username } = req.query;
    // Using API key directly for now - TODO: Move to environment variable
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBrGXFccE_qNIlL0k12KYNF8FJk1XNhx1A";

    if (!apiKey) {
      return res.status(500).json({ 
        error: "YouTube API key not configured" 
      });
    }

    // Extract channel ID from URL if provided
    if (url) {
      const channelIdMatch = url.match(/\/channel\/([a-zA-Z0-9_-]+)/);
      if (channelIdMatch) {
        return res.json({ 
          success: true, 
          channelId: channelIdMatch[1],
          source: "url"
        });
      }

      const handleMatch = url.match(/\/@([a-zA-Z0-9_-]+)/);
      if (handleMatch) {
        // Try to get channel ID from handle
        try {
          const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                part: "snippet",
                q: handleMatch[1],
                type: "channel",
                maxResults: 1,
                key: apiKey,
              },
            }
          );
          if (response.data.items && response.data.items.length > 0) {
            return res.json({
              success: true,
              channelId: response.data.items[0].id.channelId,
              channelTitle: response.data.items[0].snippet.title,
              source: "handle"
            });
          }
        } catch (err) {
          console.error("Error fetching channel by handle:", err);
        }
      }
    }

    // Try username/handle
    const searchTerm = handle || username;
    if (searchTerm) {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              q: searchTerm,
              type: "channel",
              maxResults: 1,
              key: apiKey,
            },
          }
        );
        if (response.data.items && response.data.items.length > 0) {
          return res.json({
            success: true,
            channelId: response.data.items[0].id.channelId,
            channelTitle: response.data.items[0].snippet.title,
            source: "search"
          });
        }
      } catch (err) {
        console.error("Error searching for channel:", err);
      }
    }

    return res.status(400).json({
      error: "Could not find channel ID",
      message: "Please provide a valid channel URL, handle, or username"
    });
  } catch (error) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to get channel ID",
      message: error.response?.data?.error?.message || error.message,
    });
  }
});

export default router;

