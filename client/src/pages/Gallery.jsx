// client/src/pages/Gallery.jsx
import React, { useState, useMemo, useEffect } from "react";
import "./Gallery.css";
import { galleryData as fallbackGalleryData } from "../data/galleryData";
import { getGalleryItems } from "../services/galleryService";
import API from "../utils/api";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageOrientations, setImageOrientations] = useState({});
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [galleryError, setGalleryError] = useState(null);

  // YouTube Playlist ID - Set this in your environment or config
  // Get playlist ID from the playlist URL: https://www.youtube.com/playlist?list=PLAYLIST_ID
  const YOUTUBE_PLAYLIST_ID = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID || "PL7_T4oO_C6rWhsZ6DUZBUfsu9fGaz_tsg"; // Default to your playlist

  // Fetch YouTube videos from playlist
  const fetchYouTubeVideos = async () => {
    if (!YOUTUBE_PLAYLIST_ID) {
      console.warn("YouTube Playlist ID not configured. Set VITE_YOUTUBE_PLAYLIST_ID in environment variables.");
      return;
    }

    setLoadingVideos(true);
    setVideoError(null);
    try {
      const response = await API.get(`/youtube/playlist`, {
        params: {
          playlistId: YOUTUBE_PLAYLIST_ID,
          maxResults: 50,
        },
      });
      if (response.data.success) {
        setYoutubeVideos(response.data.videos || []);
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      setVideoError(error.response?.data?.error || error.response?.data?.message || "Failed to load videos");
    } finally {
      setLoadingVideos(false);
    }
  };

  // Fetch gallery items from Firebase
  const fetchGalleryItems = async () => {
    setLoadingGallery(true);
    setGalleryError(null);
    try {
      const items = await getGalleryItems();
      // Transform Firebase data to match the expected format
      const transformedItems = items.map(item => ({
        id: item.id,
        image: item.imageUrl || item.image,
        eventName: item.eventName,
        location: item.location,
        description: item.description,
        attendees: item.attendees,
        orientation: item.orientation || 'landscape'
      }));
      setGalleryItems(transformedItems);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setGalleryError("Failed to load gallery. Using fallback data.");
      // Fallback to static data if Firebase fails
      setGalleryItems(fallbackGalleryData);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Fetch videos on component mount and set up auto-refresh
  useEffect(() => {
    fetchGalleryItems();
    fetchYouTubeVideos();

    // Auto-refresh videos every 5 minutes to get new uploads
    const refreshInterval = setInterval(() => {
      fetchYouTubeVideos();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [YOUTUBE_PLAYLIST_ID]);

  // Detect image orientation when image loads
  const handleImageLoad = (itemId, event) => {
    const img = event.target;
    const isPortrait = img.naturalHeight > img.naturalWidth;
    setImageOrientations(prev => ({
      ...prev,
      [itemId]: isPortrait ? "portrait" : "landscape"
    }));
  };

  const openModal = (item, isVideo = false) => {
    setSelectedImage({ ...item, isVideo });
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  // Close modal on Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedImage) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedImage]);

  // Separate gallery items into landscape and portrait
  const { landscapeItems, portraitItems, videoItems } = useMemo(() => {
    const landscape = [];
    const portrait = [];
    const videos = [];
    
    // Process image gallery items
    galleryItems.forEach((item) => {
      // Use detected orientation or fallback to item.orientation
      const detectedOrientation = imageOrientations[item.id] || item.orientation;
      const itemWithOrientation = { ...item, currentOrientation: detectedOrientation };
      
      if (detectedOrientation === "portrait") {
        portrait.push(itemWithOrientation);
      } else {
        landscape.push(itemWithOrientation);
      }
    });

    // Process YouTube videos (all videos are treated as landscape for display)
    youtubeVideos.forEach((video) => {
      videos.push({
        ...video,
        currentOrientation: "landscape",
        isVideo: true,
      });
    });
    
    return { landscapeItems: landscape, portraitItems: portrait, videoItems: videos };
  }, [imageOrientations, youtubeVideos, galleryItems]);

  return (
    <main className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="gallery-hero__container">
          <h1 className="gallery-hero__title">Our Gallery</h1>
          <p className="gallery-hero__subtitle">
            Capturing moments from our events, meetings, and networking sessions
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-section">
        <div className="gallery-container">
          {loadingGallery && (
            <div className="gallery-loading-message">
              Loading gallery...
            </div>
          )}
          {galleryError && (
            <div className="gallery-error-message" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px' }}>
              {galleryError}
            </div>
          )}
          {/* Landscape Images Section */}
          {landscapeItems.length > 0 && (
            <div className="gallery-grid">
              {landscapeItems.map((item) => {
                const detectedOrientation = item.currentOrientation;
                return (
                  <div
                    key={item.id}
                    className={`gallery-item gallery-item--${detectedOrientation}`}
                    onClick={() => openModal({...item, orientation: detectedOrientation})}
                  >
                    <div className="gallery-item__image-wrapper">
                      <img
                        src={encodeURI(item.image)}
                        alt={item.eventName}
                        className="gallery-item__image"
                        loading="lazy"
                        onLoad={(e) => handleImageLoad(item.id, e)}
                        onError={(e) => {
                          e.target.src = '/venuslogo.png'; // Fallback image
                          e.target.alt = 'Image not available';
                        }}
                      />
                      <div className="gallery-item__overlay">
                        <div className="gallery-item__info">
                          <h3 className="gallery-item__title">{item.eventName}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Portrait Images Section - Starts on new row */}
          {portraitItems.length > 0 && (
            <div className="gallery-grid gallery-grid--portrait">
              {portraitItems.map((item) => {
                const detectedOrientation = item.currentOrientation;
                return (
                  <div
                    key={item.id}
                    className={`gallery-item gallery-item--${detectedOrientation}`}
                    onClick={() => openModal({...item, orientation: detectedOrientation})}
                  >
                    <div className="gallery-item__image-wrapper">
                      <img
                        src={encodeURI(item.image)}
                        alt={item.eventName}
                        className="gallery-item__image"
                        loading="lazy"
                        onLoad={(e) => handleImageLoad(item.id, e)}
                        onError={(e) => {
                          e.target.src = '/venuslogo.png'; // Fallback image
                          e.target.alt = 'Image not available';
                        }}
                      />
                      <div className="gallery-item__overlay">
                        <div className="gallery-item__info">
                          <h3 className="gallery-item__title">{item.eventName}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* YouTube Videos Section */}
          <div className="gallery-videos-section">
            {!YOUTUBE_PLAYLIST_ID && (
              <div className="gallery-info-message">
                <p>To display YouTube videos, please set <code>VITE_YOUTUBE_PLAYLIST_ID</code> in your environment variables.</p>
                <p>Get your Playlist ID from the playlist URL: <code>https://www.youtube.com/playlist?list=PLAYLIST_ID</code></p>
                <p>The Playlist ID is the part after <code>list=</code> in the URL.</p>
              </div>
            )}
            {YOUTUBE_PLAYLIST_ID && loadingVideos && (
              <div className="gallery-loading-message">
                Loading videos...
              </div>
            )}
            {videoError && (
              <div className="gallery-error-message">
                {videoError}
              </div>
            )}
            {videoItems.length > 0 && (
              <div className="gallery-grid gallery-grid--videos">
                {videoItems.map((video) => (
                  <div
                    key={video.id}
                    className="gallery-item gallery-item--video gallery-item--landscape"
                    onClick={() => openModal(video, true)}
                  >
                    <div className="gallery-item__image-wrapper">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="gallery-item__image"
                        loading="lazy"
                      />
                      <div className="gallery-item__video-overlay">
                        <div className="gallery-item__play-button">
                          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="rgba(0, 0, 0, 0.6)"/>
                            <path d="M26 20L44 32L26 44V20Z" fill="white"/>
                          </svg>
                        </div>
                      </div>
                      <div className="gallery-item__overlay">
                        <div className="gallery-item__info">
                          <h3 className="gallery-item__title">{video.title}</h3>
                          <div className="gallery-item__video-meta">
                            <span className="gallery-item__video-views">
                              {parseInt(video.viewCount).toLocaleString()} views
                            </span>
                            <span className="gallery-item__video-date">
                              {new Date(video.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {YOUTUBE_PLAYLIST_ID && !loadingVideos && videoItems.length === 0 && !videoError && (
              <div className="gallery-info-message">
                No videos found. Make sure your playlist has videos.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal for detailed view */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="gallery-modal__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery-modal__close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className={`gallery-modal__body ${selectedImage.isVideo ? 'gallery-modal__body--video' : ''}`}>
              {selectedImage.isVideo ? (
                <>
                  <div className="gallery-modal__video-wrapper">
                    <iframe
                      src={selectedImage.embedUrl}
                      title={selectedImage.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="gallery-modal__video"
                    ></iframe>
                  </div>
                  <div className="gallery-modal__details">
                    <h2 className="gallery-modal__title">{selectedImage.title}</h2>
                    <div className="gallery-modal__meta">
                      <div className="gallery-modal__meta-item">
                        <span className="gallery-modal__meta-label">Channel:</span>
                        <span className="gallery-modal__meta-value">{selectedImage.channelTitle}</span>
                      </div>
                      <div className="gallery-modal__meta-item">
                        <span className="gallery-modal__meta-label">Published:</span>
                        <span className="gallery-modal__meta-value">
                          {new Date(selectedImage.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="gallery-modal__meta-item">
                        <span className="gallery-modal__meta-label">Views:</span>
                        <span className="gallery-modal__meta-value">
                          {parseInt(selectedImage.viewCount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="gallery-modal__description">
                      <p>{selectedImage.description || "No description available."}</p>
                    </div>
                    <div className="gallery-modal__video-actions">
                      <a
                        href={selectedImage.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gallery-modal__watch-button"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`gallery-modal__image-wrapper gallery-modal__image-wrapper--${selectedImage.orientation}`}>
                    <img
                      src={encodeURI(selectedImage.image)}
                      alt={selectedImage.eventName}
                      className="gallery-modal__image"
                      onError={(e) => {
                        e.target.src = '/venuslogo.png'; // Fallback image
                        e.target.alt = 'Image not available';
                      }}
                    />
                  </div>
                  <div className="gallery-modal__details">
                    <h2 className="gallery-modal__title">{selectedImage.eventName}</h2>
                    <div className="gallery-modal__description">
                      <p>{selectedImage.description}</p>
                    </div>
                    <div className="gallery-modal__attendees">
                      <h3 className="gallery-modal__attendees-title">Meeting Details:</h3>
                      <p className="gallery-modal__attendees-text">{selectedImage.attendees}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Gallery;

